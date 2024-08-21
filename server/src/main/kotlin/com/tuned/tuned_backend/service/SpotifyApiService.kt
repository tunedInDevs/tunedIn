package com.tuned.tuned_backend.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper

@Service
class SpotifyApiService @Autowired constructor(
    private val restTemplate: RestTemplate,
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
}