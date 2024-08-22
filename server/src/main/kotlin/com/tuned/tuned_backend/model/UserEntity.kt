package com.tuned.tuned_backend.model

import jakarta.persistence.*

@Entity
@Table(name = "users")
data class User(
    @Id
    val id: String,
    val username: String
){
    constructor() : this("", "") {

    }
}