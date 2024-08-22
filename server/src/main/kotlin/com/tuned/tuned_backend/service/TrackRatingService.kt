package com.tuned.tuned_backend.service

import com.tuned.tuned_backend.model.RatedTrack
import com.tuned.tuned_backend.repository.RatedTrackRepository
import com.tuned.tuned_backend.repository.UserRepository
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service

@Service
class TrackRatingService(
    private val userRepository: UserRepository,
    private val ratedTrackRepository: RatedTrackRepository
) {
    @Transactional
    fun addTrackToUserRatedList(userId: String, spotifyTrackId: String) {
        if (!userRepository.existsById(userId)) {
            throw RuntimeException("User not found")
        }
        if (!ratedTrackRepository.existsByUserIdAndSpotifyTrackId(userId, spotifyTrackId)) {
            val ratedTrack = RatedTrack(userId = userId, spotifyTrackId = spotifyTrackId)
            ratedTrackRepository.save(ratedTrack)
        }
    }

    fun getUserRatedTracks(userId: String): List<RatedTrack> {
        return ratedTrackRepository.findByUserId(userId)
    }

    @Transactional
    fun removeTrackFromUserRatedList(userId: String, spotifyTrackId: String) {
        ratedTrackRepository.deleteByUserIdAndSpotifyTrackId(userId, spotifyTrackId)
    }

    @Transactional
    fun updateTrackRating(userId: String, spotifyTrackId: String, rating: Int) {
        val ratedTrack = ratedTrackRepository.findByUserIdAndSpotifyTrackId(userId, spotifyTrackId)
            ?: throw RuntimeException("Track not found in user's rated list")
        ratedTrack.rating = rating
        ratedTrackRepository.save(ratedTrack)
    }
}