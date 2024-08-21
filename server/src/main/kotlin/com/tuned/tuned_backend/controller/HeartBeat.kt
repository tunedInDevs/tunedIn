package com.tuned.tuned_backend.controller

import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.GetMapping

@RestController
class TunedController {

    @GetMapping("/heartbeat")
    fun heartbeat(): String {
        return "heartbeat"
    }
}