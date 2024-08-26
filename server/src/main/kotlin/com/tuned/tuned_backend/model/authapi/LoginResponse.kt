package com.tuned.tuned_backend.model.authapi

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty

@JsonIgnoreProperties(ignoreUnknown = true)
data class LoginResponse (
    @JsonProperty("uri") val uri: String = ""
)