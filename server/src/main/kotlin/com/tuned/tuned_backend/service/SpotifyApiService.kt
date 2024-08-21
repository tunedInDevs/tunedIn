package com.tuned.tuned_backend.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.tuned.tuned_backend.model.SpotifyToken
import com.tuned.tuned_backend.model.TokenResponse
import com.tuned.tuned_backend.repository.SpotifyTokenRepository
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.util.LinkedMultiValueMap

@Service
class SpotifyApiService @Autowired constructor(
    private val restTemplate: RestTemplate,
    private val spotifyTokenRepository: SpotifyTokenRepository
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

    private val mapper = jacksonObjectMapper()

    fun getAuthorizationUrl(): String {
        return "https://accounts.spotify.com/authorize" +
                "?client_id=$clientId" +
                "&response_type=code" +
                "&redirect_uri=$redirectUri" +
                "&scope=user-read-private%20user-read-email%20user-top-read"
    }

    fun handleAuthorizationCode(code: String): String {
        val tokenResponse = exchangeCodeForTokens(code)
        // Here you would typically associate the token with a user
        // For this example, we're just saving it with a dummy user ID
        saveSpotifyToken(1L, tokenResponse)
        return tokenResponse.accessToken
    }

    fun refreshToken(userId: Long) {
        val spotifyToken = spotifyTokenRepository.findByUserId(userId)
            ?: throw RuntimeException("No token found for user $userId")

        val tokenResponse = refreshAccessToken(spotifyToken.refreshToken)
        saveSpotifyToken(userId, tokenResponse)
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

    private fun saveSpotifyToken(userId: Long, tokenResponse: TokenResponse) {
        val spotifyToken = SpotifyToken(
            userId = userId,
            accessToken = tokenResponse.accessToken,
            refreshToken = tokenResponse.refreshToken,
            expiresIn = tokenResponse.expiresIn,
            tokenType = tokenResponse.tokenType
        )
        spotifyTokenRepository.save(spotifyToken)
    }
}