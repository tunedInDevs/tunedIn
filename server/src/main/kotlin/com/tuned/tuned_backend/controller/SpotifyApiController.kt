package com.tuned.tuned_backend.controller

import com.tuned.tuned_backend.model.spotifyapi.SpotifySearchResponse
import com.tuned.tuned_backend.model.spotifyapi.SpotifyTrackResponse
import com.tuned.tuned_backend.model.spotifyapi.SpotifyUserResponse
import com.tuned.tuned_backend.service.SpotifyApiService
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
@RequestMapping("/api/spotify")
@SecurityRequirement(name = "bearer-jwt")
@Tag(name = "Spotify API", description = "Endpoints for interacting with Spotify API")
class SpotifyApiController(private val spotifyApiService: SpotifyApiService) {

    @Operation(summary = "Get user profile", description = "Retrieves the Spotify profile of the authenticated user")
    @ApiResponse(responseCode = "200", description = "User profile retrieved successfully",
        content = [Content(mediaType = "application/json",
            schema = Schema(implementation = SpotifyUserResponse::class))])
    @ApiResponse(responseCode = "500", description = "Failed to retrieve user profile")
    @GetMapping("/profile")
    fun getUserProfileFromAccessCode(@Parameter(hidden = true) @AuthenticationPrincipal userId: String): ResponseEntity<SpotifyUserResponse?> {
        return try {
            val profile = spotifyApiService.getSpotifyProfileFromUserId(userId)
            ResponseEntity.ok(profile)
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null)
        }
    }

    @Operation(summary = "Search tracks", description = "Searches for tracks on Spotify based on the provided query")
    @ApiResponse(responseCode = "200", description = "Search results retrieved successfully")
    @ApiResponse(responseCode = "500", description = "Search failed")
    @GetMapping("/search")
    fun searchTracks(
        @Parameter(hidden = true) @AuthenticationPrincipal userId: String,
        @Parameter(description = "Search query") @RequestParam query: String,
        @Parameter(description = "Search type [track, album, artist, ...]") @RequestParam type: String,
        @Parameter(description = "Market code") @RequestParam(required = false) market: String?,
        @Parameter(description = "Limit of results") @RequestParam(required = false) limit: Int?,
        @Parameter(description = "Offset for pagination") @RequestParam(required = false) offset: Int?,
        @Parameter(description = "Include external content") @RequestParam(required = false) includeExternal: String?
    ): ResponseEntity<SpotifySearchResponse> {
        return try {
            val searchResult = spotifyApiService.searchTracks(userId, query, type, market, limit, offset, includeExternal)
            ResponseEntity.ok(searchResult)
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null)
        }
    }

    @Operation(summary = "Get track details", description = "Retrieves details of a specific track from Spotify")
    @ApiResponse(responseCode = "200", description = "Track details retrieved successfully")
    @ApiResponse(responseCode = "500", description = "Failed to fetch track details")
    @GetMapping("/track/{trackId}")
    fun getTrack(
        @Parameter(description = "ID of the track") @PathVariable trackId: String,
        @Parameter(hidden = true) @AuthenticationPrincipal userId: String
    ): ResponseEntity<SpotifyTrackResponse?> {
        return try {
            val trackInfo = spotifyApiService.getTrack(userId, trackId)
            ResponseEntity.ok(trackInfo)
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null)
        }
    }
}