package com.tuned.tuned_backend.model

import com.fasterxml.jackson.annotation.JsonProperty

data class UserRatedTrackResponse (
    @JsonProperty("track") val track: SpotifyTrackResponse,
    @JsonProperty("rating") val rating: Double
)