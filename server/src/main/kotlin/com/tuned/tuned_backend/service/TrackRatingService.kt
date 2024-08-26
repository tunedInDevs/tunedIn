package com.tuned.tuned_backend.service

import com.tuned.tuned_backend.model.RatedTrack
import com.tuned.tuned_backend.model.SpotifyTrackResponse
import com.tuned.tuned_backend.model.UserRatedTrackResponse
import com.tuned.tuned_backend.repository.RatedTrackRepository
import com.tuned.tuned_backend.repository.UserRepository
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service

@Service
class TrackRatingService(
    private val userRepository: UserRepository,
    private val ratedTrackRepository: RatedTrackRepository,
    private val spotifyApiService: SpotifyApiService
) {
    @Transactional
    fun addTrackToUserRatedList(userId: String, spotifyTrackId: String, rating: Double) {
        if (!userRepository.existsById(userId)) {
            throw RuntimeException("User not found")
        }
        if (!ratedTrackRepository.existsByUserIdAndSpotifyTrackId(userId, spotifyTrackId)) {
            val ratedTrack = RatedTrack(userId = userId, spotifyTrackId = spotifyTrackId, rating = rating)
            ratedTrackRepository.save(ratedTrack)
        }
    }

    fun getUserRatedTracks(userId: String): List<UserRatedTrackResponse> {
        val ratedTracks = ratedTrackRepository.findByUserId(userId)
        val ratedTracksDetailed : MutableList<UserRatedTrackResponse> = mutableListOf()
        ratedTracks.map {
            val track = spotifyApiService.getTrack(userId, it.spotifyTrackId)
            ratedTracksDetailed.add(UserRatedTrackResponse(track, it.rating))
        }
        return ratedTracksDetailed
    }

    @Transactional
    fun removeTrackFromUserRatedList(userId: String, spotifyTrackId: String) {
        ratedTrackRepository.deleteByUserIdAndSpotifyTrackId(userId, spotifyTrackId)
    }

    @Transactional
    fun updateTrackRating(userId: String, spotifyTrackId: String, rating: Double) {
        val ratedTrack = ratedTrackRepository.findByUserIdAndSpotifyTrackId(userId, spotifyTrackId)
            ?: throw RuntimeException("Track not found in user's rated list")
        ratedTrack.rating = rating
        ratedTrackRepository.save(ratedTrack)
    }
}