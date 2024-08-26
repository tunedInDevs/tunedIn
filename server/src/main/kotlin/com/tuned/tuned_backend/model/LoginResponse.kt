package com.tuned.tuned_backend.model

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Response containing JWT and Spotify user profile")
data class LoginResponse(
    @field:Schema(description = "JWT token for authenticated requests")
    val token: String,

    @field:Schema(description = "Spotify user profile information")
    val profile: SpotifyUserResponse
)