package com.tuned.tuned_backend.model

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import java.time.Instant

@Entity
data class SpotifyTokenEntity(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    val userId: String,
    var accessToken: String,
    var refreshToken: String,
    var expiresIn: Int,
    var tokenType: String,
    var updatedAt: Instant
) {
    constructor() : this(0,"","","",0,"", Instant.now()) {

    }
}