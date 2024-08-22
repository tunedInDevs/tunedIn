package com.tuned.tuned_backend.repository

import com.tuned.tuned_backend.model.RatedTrack
import org.springframework.data.jpa.repository.JpaRepository

interface RatedTrackRepository : JpaRepository<RatedTrack, Long> {
    fun findByUserId(userId: String): List<RatedTrack>
    fun existsByUserIdAndSpotifyTrackId(userId: String, spotifyTrackId: String): Boolean
    fun findByUserIdAndSpotifyTrackId(userId: String, spotifyTrackId: String): RatedTrack?
    fun deleteByUserIdAndSpotifyTrackId(userId: String, spotifyTrackId: String)
}