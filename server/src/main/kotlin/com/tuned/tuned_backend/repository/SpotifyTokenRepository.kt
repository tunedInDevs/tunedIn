package com.tuned.tuned_backend.repository

import com.tuned.tuned_backend.model.SpotifyToken
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface SpotifyTokenRepository : JpaRepository<SpotifyToken, Long> {
    fun findByUserId(userId: Long): SpotifyToken?
}