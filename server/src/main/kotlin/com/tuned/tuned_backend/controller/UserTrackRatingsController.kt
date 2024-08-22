package com.tuned.tuned_backend.controller

import com.tuned.tuned_backend.model.RatedTrack
import com.tuned.tuned_backend.service.TrackRatingService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/users")
class UserRatedTracksController(private val trackRatingService: TrackRatingService) {

    @PostMapping("/{userId}/rated-tracks")
    fun addRatedTrack(
        @PathVariable userId: String,
        @RequestParam spotifyTrackId: String
    ): ResponseEntity<String> {
        return try {
            trackRatingService.addTrackToUserRatedList(userId, spotifyTrackId)
            ResponseEntity.status(HttpStatus.CREATED).body("Track added to rated list successfully")
        } catch (e: RuntimeException) {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.message)
        }
    }

    @GetMapping("/{userId}/rated-tracks")
    fun getUserRatedTracks(@PathVariable userId: String): ResponseEntity<List<RatedTrack>> {
        val ratedTracks = trackRatingService.getUserRatedTracks(userId)
        return ResponseEntity.ok(ratedTracks)
    }

    @DeleteMapping("/{userId}/rated-tracks/{spotifyTrackId}")
    fun removeRatedTrack(
        @PathVariable userId: String,
        @PathVariable spotifyTrackId: String
    ): ResponseEntity<String> {
        return try {
            trackRatingService.removeTrackFromUserRatedList(userId, spotifyTrackId)
            ResponseEntity.ok("Track removed from rated list successfully")
        } catch (e: RuntimeException) {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.message)
        }
    }

    @PutMapping("/{userId}/rated-tracks/{spotifyTrackId}")
    fun updateTrackRating(
        @PathVariable userId: String,
        @PathVariable spotifyTrackId: String,
        @RequestParam rating: Int
    ): ResponseEntity<String> {
        return try {
            trackRatingService.updateTrackRating(userId, spotifyTrackId, rating)
            ResponseEntity.ok("Track rating updated successfully")
        } catch (e: RuntimeException) {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.message)
        }
    }

    @GetMapping("/test")
    fun test(): ResponseEntity<String> {
        return ResponseEntity.ok("Controller is working")
    }
}