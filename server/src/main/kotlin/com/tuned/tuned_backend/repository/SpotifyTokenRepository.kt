package com.tuned.tuned_backend.repository

import com.tuned.tuned_backend.model.SpotifyTokenEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface SpotifyTokenRepository : JpaRepository<SpotifyTokenEntity, String> {
    fun findByUserId(userId: String): SpotifyTokenEntity?
}