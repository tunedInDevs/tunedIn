package com.tuned.tuned_backend.controller

import com.tuned.tuned_backend.model.LoginResponse
import com.tuned.tuned_backend.model.SpotifyUserResponse
import com.tuned.tuned_backend.service.JwtService
import com.tuned.tuned_backend.service.SpotifyApiService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/spotify")
class SpotifyApiController(private val spotifyApiService: SpotifyApiService, private val jwtService: JwtService) {

    @GetMapping("/login")
    fun login(): ResponseEntity<String> {
        val authUrl = spotifyApiService.getAuthorizationUrl()
        return ResponseEntity.ok(authUrl)
    }

    @GetMapping("/callback")
    fun handleCallback(@RequestParam code: String): ResponseEntity<LoginResponse?> {
        return try {
            val spotifyProfile = spotifyApiService.handleAuthorizationCode(code)
            val jwt = jwtService.generateToken(spotifyProfile.id)
            return ResponseEntity.ok(LoginResponse(jwt, spotifyProfile))
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null)
        }
    }

    @GetMapping("/refresh")
    fun refreshToken(@RequestParam userId: String): ResponseEntity<String> {
        return try {
            spotifyApiService.refreshToken(userId)
            ResponseEntity.ok("Token refreshed successfully")
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Token refresh failed: ${e.message}")
        }
    }

    @GetMapping("/profile")
    fun getUserProfileFromAccessCode(@RequestParam userId: String): ResponseEntity<SpotifyUserResponse?> {
        return try {
            val profile = spotifyApiService.getSpotifyProfileFromUserId(userId)
            ResponseEntity.ok(profile)
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null)
        }
    }

    @GetMapping("/search")
    fun searchTracks(
        @RequestParam userId: String,
        @RequestParam query: String,
        @RequestParam(required = false) market: String?,
        @RequestParam(required = false) limit: Int?,
        @RequestParam(required = false) offset: Int?,
        @RequestParam(required = false) includeExternal: String?
    ): ResponseEntity<String> {
        return spotifyApiService.searchTracks(userId, query, market, limit, offset, includeExternal)
    }

    @GetMapping("/track/{trackId}")
    fun getTrack(@PathVariable trackId: String, @RequestParam userId: String): ResponseEntity<String> {
        return try {
            val trackInfo = spotifyApiService.getTrack(userId, trackId)
            ResponseEntity.ok(trackInfo)
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch track: ${e.message}")
        }
    }
}
