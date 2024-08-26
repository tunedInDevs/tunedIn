package com.tuned.tuned_backend.model

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty

@JsonIgnoreProperties(ignoreUnknown = true)
data class SpotifyTrackResponse(
    @JsonProperty("id") val spotifyId: String,
    @JsonProperty("name") val name: String,
    @JsonProperty("duration_ms") val durationMs: Int,
    @JsonProperty("explicit") val explicit: Boolean,
    @JsonProperty("popularity") val popularity: Int,
    @JsonProperty("preview_url") val previewUrl: String?,
    @JsonProperty("track_number") val trackNumber: Int,
    @JsonProperty("type") val type: String,
    @JsonProperty("uri") val uri: String,
    @JsonProperty("is_local") val isLocal: Boolean,
    @JsonProperty("album") val album: Album?,
    @JsonProperty("artists") val artists: List<Artist>,
    @JsonProperty("available_markets") val availableMarkets: List<String>,
    @JsonProperty("external_ids") val externalIds: ExternalIds,
    @JsonProperty("external_urls") val externalUrls: ExternalUrls
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class Album(
    @JsonProperty("id") val id: String,
    @JsonProperty("name") val name: String,
    @JsonProperty("album_type") val albumType: String,
    @JsonProperty("total_tracks") val totalTracks: Int,
    @JsonProperty("available_markets") val availableMarkets: List<String>,
    @JsonProperty("external_urls") val externalUrls: ExternalUrls,
    @JsonProperty("href") val href: String,
    @JsonProperty("images") val images: List<AlbumImage>,
    @JsonProperty("release_date") val releaseDate: String,
    @JsonProperty("release_date_precision") val releaseDatePrecision: String,
    @JsonProperty("type") val type: String,
    @JsonProperty("uri") val uri: String
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class Artist(
    @JsonProperty("id") val id: String,
    @JsonProperty("name") val name: String,
    @JsonProperty("type") val type: String,
    @JsonProperty("uri") val uri: String,
    @JsonProperty("external_urls") val externalUrls: ExternalUrls
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class AlbumImage(
    @JsonProperty("url") val url: String,
    @JsonProperty("height") val height: Int,
    @JsonProperty("width") val width: Int
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class ExternalUrls(
    @JsonProperty("spotify") val spotify: String
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class ExternalIds(
    @JsonProperty("isrc") val isrc: String?
)