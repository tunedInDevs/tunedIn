package com.tuned.tuned_backend.model.entities

import jakarta.persistence.*

@Entity
@Table(name = "rated_tracks")
data class RatedTrack(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(name = "user_id")
    val userId: String = "",

    @Column(name = "spotify_track_id")
    val spotifyTrackId: String = "",

    @Column(name = "rating")
    var rating: Double = 0.0
)