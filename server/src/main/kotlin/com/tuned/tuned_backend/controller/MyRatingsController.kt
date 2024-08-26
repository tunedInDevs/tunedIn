package com.tuned.tuned_backend.controller

import com.tuned.tuned_backend.model.RatedTrack
import com.tuned.tuned_backend.model.ratingsapi.UserRatedTrackResponse
import com.tuned.tuned_backend.service.TrackRatingService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/me")
@SecurityRequirement(name = "bearer-jwt")
@Tag(name = "User Rated Tracks", description = "Endpoints for managing user's rated tracks")
class MyRatingsController(private val trackRatingService: TrackRatingService) {

    @Operation(summary = "Add a track to user's rated list", description = "Adds a specified Spotify track to the user's rated tracks list")
    @ApiResponse(responseCode = "201", description = "Track added successfully",
        content = [Content(mediaType = "application/json", schema = Schema(implementation = RatedTrack::class))]
    )
    @ApiResponse(responseCode = "404", description = "Track not found")
    @PostMapping("/rated-tracks")
    fun addRatedTrack(
        @Parameter(hidden = true) @AuthenticationPrincipal userId: String,
        @Parameter(description = "Spotify Track ID", required = true) @RequestParam spotifyTrackId: String,
        @Parameter(description = "The initial rating for this track") @RequestParam rating: Double
    ): ResponseEntity<RatedTrack> {
        return try {
            val ratedTrack = trackRatingService.addTrackToUserRatedList(userId, spotifyTrackId, rating)
            ResponseEntity.status(HttpStatus.CREATED).body(ratedTrack)
        } catch (e: RuntimeException) {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(null)
        }
    }

    @Operation(summary = "Get user's rated tracks", description = "Retrieves the list of tracks rated by the user")
    @ApiResponse(
        responseCode = "200",
        description = "Successfully retrieved rated tracks",
        content = [Content(mediaType = "application/json", schema = Schema(implementation = UserRatedTrackResponse::class))]
    )
    @GetMapping("/rated-tracks")
    fun getUserRatedTracks(@Parameter(hidden = true) @AuthenticationPrincipal userId: String): ResponseEntity<List<UserRatedTrackResponse>> {
        val ratedTracks = trackRatingService.getUserRatedTracks(userId)
        return ResponseEntity.ok(ratedTracks)
    }

    @Operation(summary = "Remove a track from user's rated list", description = "Removes a specified track from the user's rated tracks list")
    @ApiResponse(responseCode = "200", description = "Track removed successfully",
        content = [Content(mediaType = "application/json", schema = Schema(implementation = RatedTrack::class))]
    )
    @ApiResponse(responseCode = "404", description = "Track not found in user's rated list")
    @DeleteMapping("/rated-tracks/{spotifyTrackId}")
    fun removeRatedTrack(
        @Parameter(hidden = true) @AuthenticationPrincipal userId: String,
        @Parameter(description = "Spotify Track ID", required = true) @PathVariable spotifyTrackId: String
    ): ResponseEntity<RatedTrack> {
        return try {
            val ratedTrack = trackRatingService.removeTrackFromUserRatedList(userId, spotifyTrackId)
            ResponseEntity.ok(ratedTrack)
        } catch (e: RuntimeException) {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(null)
        }
    }

    @Operation(summary = "Update track rating", description = "Updates the rating of a specified track for the user")
    @ApiResponse(responseCode = "200", description = "Track rating updated successfully",
        content = [Content(mediaType = "application/json", schema = Schema(implementation = RatedTrack::class))]
    )
    @ApiResponse(responseCode = "404", description = "Track not found in user's rated list")
    @PutMapping("/rated-tracks/{spotifyTrackId}")
    fun updateTrackRating(
        @Parameter(hidden = true) @AuthenticationPrincipal userId: String,
        @Parameter(description = "Spotify Track ID", required = true) @PathVariable spotifyTrackId: String,
        @Parameter(description = "New rating value", required = true) @RequestParam rating: Double
    ): ResponseEntity<RatedTrack> {
        return try {
            val ratedTrack = trackRatingService.updateTrackRating(userId, spotifyTrackId, rating)
            ResponseEntity.ok(ratedTrack)
        } catch (e: RuntimeException) {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(null)
        }
    }

    @Operation(summary = "Test endpoint", description = "A simple endpoint to test if the controller is working")
    @ApiResponse(responseCode = "200", description = "Controller is working")
    @GetMapping("/test")
    fun test(): ResponseEntity<String> {
        return ResponseEntity.ok("Controller is working")
    }
}