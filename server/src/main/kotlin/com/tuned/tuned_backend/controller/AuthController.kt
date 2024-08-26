package com.tuned.tuned_backend.controller

import com.tuned.tuned_backend.model.LoginResponse
import com.tuned.tuned_backend.service.JwtService
import com.tuned.tuned_backend.service.SpotifyApiService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Endpoints for Spotify authentication and JWT generation")
class AuthController(
    private val spotifyApiService: SpotifyApiService,
    private val jwtService: JwtService
) {
    @Operation(
        summary = "Get Spotify login URL",
        description = "Retrieves the Spotify authorization URL for user login"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Successfully retrieved authorization URL",
        content = [Content(mediaType = "text/plain", schema = Schema(type = "string"))]
    )
    @GetMapping("/login")
    fun login(): ResponseEntity<String> {
        val authUrl = spotifyApiService.getAuthorizationUrl()
        return ResponseEntity.ok(authUrl)
    }

    @Operation(
        summary = "Handle Spotify callback",
        description = "Processes the authorization code from Spotify and returns a JWT token along with the user profile"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Successfully authenticated and generated JWT",
        content = [Content(mediaType = "application/json", schema = Schema(implementation = LoginResponse::class))]
    )
    @ApiResponse(
        responseCode = "500",
        description = "Internal server error during authentication process"
    )
    @GetMapping("/callback")
    fun handleCallback(
        @Parameter(description = "Authorization code returned by Spotify", required = true)
        @RequestParam code: String
    ): ResponseEntity<LoginResponse?> {
        return try {
            val spotifyProfile = spotifyApiService.handleCallback(code)
            val jwt = jwtService.generateToken(spotifyProfile.id)
            ResponseEntity.ok(LoginResponse(jwt, spotifyProfile))
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null)
        }
    }
}