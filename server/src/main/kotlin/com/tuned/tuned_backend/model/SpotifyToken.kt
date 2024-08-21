package com.tuned.tuned_backend.model

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id

@Entity
data class SpotifyToken(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    val userId: Long,
    var accessToken: String,
    var refreshToken: String,
    var expiresIn: Int,
    var tokenType: String
) {
    constructor() : this(0,0,"","",0,"") {

    }
}