package com.tuned.tuned_backend.model.ratingsapi

import com.fasterxml.jackson.annotation.JsonProperty
import com.tuned.tuned_backend.model.spotifyapi.SpotifyTrackResponse

data class UserRatedTrackResponse (
    @JsonProperty("track") val track: SpotifyTrackResponse,
    @JsonProperty("rating") val rating: Double
)