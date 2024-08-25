package com.tuned.tuned_backend.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import com.tuned.tuned_backend.model.SpotifyToken
import com.tuned.tuned_backend.model.SpotifyUserResponse
import com.tuned.tuned_backend.model.TokenResponse
import com.tuned.tuned_backend.model.User
import com.tuned.tuned_backend.repository.SpotifyTokenRepository
import com.tuned.tuned_backend.repository.UserRepository
import org.springframework.http.*
import org.springframework.util.LinkedMultiValueMap
import org.springframework.web.client.HttpClientErrorException
import org.springframework.web.util.UriComponentsBuilder
import java.time.Instant

@Service
class SpotifyApiService @Autowired constructor(
    private val restTemplate: RestTemplate,
    private val spotifyTokenRepository: SpotifyTokenRepository,
    private val userRepository: UserRepository
) {

    @Value("\${spotify.client.id}")
    private lateinit var clientId: String

    @Value("\${spotify.client.secret}")
    private lateinit var clientSecret: String

    @Value("\${spotify.redirect.uri}")
    private lateinit var redirectUri: String

    @Value("\${spotify.api.base-url}")
    private lateinit var baseUrl: String

    private val spotifyApiBaseUrl = "https://api.spotify.com/v1"

    fun getAuthorizationUrl(): String {
        return "https://accounts.spotify.com/authorize" +
                "?client_id=$clientId" +
                "&response_type=code" +
                "&redirect_uri=$redirectUri" +
                "&scope=user-read-private%20user-read-email%20user-top-read"
    }

    fun handleAuthorizationCode(code: String): SpotifyUserResponse {
        val tokenResponse = exchangeCodeForTokens(code)
        println(tokenResponse.accessToken)
        val spotifyUser = getSpotifyProfileFromAccessToken(tokenResponse.accessToken)
        saveOrUpdateSpotifyToken(spotifyUser.id, tokenResponse)
        saveOrUpdateUser(spotifyUser.id)
        return spotifyUser
    }

    fun refreshToken(userId: String) {
        val spotifyToken = spotifyTokenRepository.findByUserId(userId)
            ?: throw RuntimeException("No token found for user $userId")

        val tokenResponse = refreshAccessToken(spotifyToken.refreshToken)
        saveOrUpdateSpotifyToken(userId, tokenResponse)
    }

    private fun exchangeCodeForTokens(code: String): TokenResponse {
        val url = "https://accounts.spotify.com/api/token"
        val body = LinkedMultiValueMap<String, String>().apply {
            add("grant_type", "authorization_code")
            add("code", code)
            add("redirect_uri", redirectUri)
            add("client_id", clientId)
            add("client_secret", clientSecret)
        }

        val headers = HttpHeaders().apply {
            contentType = MediaType.APPLICATION_FORM_URLENCODED
        }

        val request = HttpEntity(body, headers)
        return restTemplate.postForObject(url, request, TokenResponse::class.java)
            ?: throw RuntimeException("Failed to obtain tokens")
    }

    private fun refreshAccessToken(refreshToken: String): TokenResponse {
        val url = "https://accounts.spotify.com/api/token"
        val body = LinkedMultiValueMap<String, String>().apply {
            add("grant_type", "refresh_token")
            add("refresh_token", refreshToken)
            add("client_id", clientId)
            add("client_secret", clientSecret)
        }

        val headers = HttpHeaders().apply {
            contentType = MediaType.APPLICATION_FORM_URLENCODED
        }

        val request = HttpEntity(body, headers)
        return restTemplate.postForObject(url, request, TokenResponse::class.java)
            ?: throw RuntimeException("Failed to refresh token")
    }

    private fun saveOrUpdateSpotifyToken(userId: String, tokenResponse: TokenResponse) {
        spotifyTokenRepository.findByUserId(userId).let { existingToken ->
            val spotifyToken = existingToken?.apply {
                accessToken = tokenResponse.accessToken
                refreshToken = tokenResponse.refreshToken
                expiresIn = tokenResponse.expiresIn
                tokenType = tokenResponse.tokenType
                updatedAt = Instant.now()
            } ?: SpotifyToken(
                userId = userId,
                accessToken = tokenResponse.accessToken,
                refreshToken = tokenResponse.refreshToken,
                expiresIn = tokenResponse.expiresIn,
                tokenType = tokenResponse.tokenType,
                updatedAt = Instant.now()
            )
            spotifyTokenRepository.save(spotifyToken)
        }
    }

    private fun saveOrUpdateUser(userId: String) {
        if (!userRepository.existsById(userId)) {
            val newUser = User(id = userId, username = userId)
            userRepository.save(newUser)
        }
    }

     private fun getSpotifyProfileFromAccessToken(accessToken: String): SpotifyUserResponse {
        val url = "$spotifyApiBaseUrl/me"
        val headers = HttpHeaders().apply {
            setBearerAuth(accessToken)
        }
        val request = HttpEntity<String>(headers)
        val response = restTemplate.exchange(url, HttpMethod.GET, request, SpotifyUserResponse::class.java)
        return response.body ?: throw RuntimeException("Failed to get Spotify user")
    }

    fun getSpotifyProfileFromUserId(userId: String): SpotifyUserResponse {
        val token = spotifyTokenRepository.findByUserId(userId)
            ?: throw RuntimeException("No token found for user $userId")
        val url = "$spotifyApiBaseUrl/me"
        val headers = HttpHeaders().apply {
            setBearerAuth(token.accessToken)
        }
        val request = HttpEntity<String>(headers)
        val response = restTemplate.exchange(url, HttpMethod.GET, request, SpotifyUserResponse::class.java)
        return response.body ?: throw RuntimeException("Failed to get Spotify user")
    }

    fun searchTracks(
        userId: String,
        query: String,
        market: String?,
        limit: Int?,
        offset: Int?,
        includeExternal: String?
    ): ResponseEntity<String> {
        val spotifyToken = spotifyTokenRepository.findByUserId(userId)
            ?: throw RuntimeException("No token found for user $userId")

        val url = UriComponentsBuilder.fromHttpUrl("$spotifyApiBaseUrl/search")
            .queryParam("q", query)
            .queryParam("type", "track")
            .apply {
                market?.let { queryParam("market", it) }
                limit?.let { queryParam("limit", it) }
                offset?.let { queryParam("offset", it) }
                includeExternal?.let { queryParam("include_external", it) }
            }
            .build()
            .toUriString()

        val headers = HttpHeaders().apply {
            setBearerAuth(spotifyToken.accessToken)
        }

        val request = HttpEntity<String>(headers)

        return try {
            val response = restTemplate.exchange(url, HttpMethod.GET, request, String::class.java)
            ResponseEntity.ok(response.body)
        } catch (e: HttpClientErrorException) {
            if (e.statusCode == HttpStatus.UNAUTHORIZED) {
                // Token might be expired, try refreshing
                refreshToken(userId)
                // Retry the request with the new token
                headers.setBearerAuth(spotifyTokenRepository.findByUserId(userId)!!.accessToken)
                val newRequest = HttpEntity<String>(headers)
                val newResponse = restTemplate.exchange(url, HttpMethod.GET, newRequest, String::class.java)
                ResponseEntity.ok(newResponse.body)
            } else {
                ResponseEntity.status(e.statusCode).body(e.responseBodyAsString)
            }
        }
    }

    fun getTrack(userId: String, trackId: String): String {
        val spotifyToken = spotifyTokenRepository.findByUserId(userId)
            ?: throw RuntimeException("No token found for user $userId")

        val url = "https://api.spotify.com/v1/tracks/$trackId"

        val headers = HttpHeaders().apply {
            set("Authorization", "Bearer ${spotifyToken.accessToken}")
        }

        val entity = HttpEntity<String>(headers)

        try {
            val response = restTemplate.exchange(url, HttpMethod.GET, entity, String::class.java)

            if (response.statusCode != HttpStatus.OK) {
                throw Exception("Failed to fetch track: ${response.body}")
            }

            return response.body ?: throw Exception("Response body is null")
        } catch (e: Exception) {
            throw Exception("Error fetching track: ${e.message}")
        }
    }
}