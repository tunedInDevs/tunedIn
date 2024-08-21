package com.tuned.tuned_backend.controller

import com.tuned.tuned_backend.service.SpotifyApiService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/spotify")
class SpotifyApiController(private val spotifyApiService: SpotifyApiService) {

    @GetMapping("/login")
    fun login(): String {
        return spotifyApiService.getAuthorizationUrl()
    }
}
