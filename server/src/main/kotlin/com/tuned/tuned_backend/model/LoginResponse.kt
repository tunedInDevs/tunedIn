package com.tuned.tuned_backend.model

data class LoginResponse(
    val token: String,
    val userProfile: SpotifyUserResponse
)