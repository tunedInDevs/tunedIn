package com.tuned.tuned_backend.model.spotifyapi

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty

@JsonIgnoreProperties(ignoreUnknown = true)
data class SpotifySearchResponse(
    @JsonProperty("tracks") val tracks: SpotifyTracksResponse = SpotifyTracksResponse()
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class SpotifyTracksResponse(
    @JsonProperty("href") val href: String = "",
    @JsonProperty("items") val items: List<SpotifyTrackResponse> = listOf(),
    @JsonProperty("limit") val limit: Int = 20,
    @JsonProperty("next") val next: String? = null,
    @JsonProperty("offset") val offset: Int = 0,
    @JsonProperty("previous") val previous: String? = null,
    @JsonProperty("total") val total: Int = 0
)