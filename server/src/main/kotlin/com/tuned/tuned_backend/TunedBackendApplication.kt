package com.tuned.tuned_backend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class TunedBackendApplication

fun main(args: Array<String>) {
	runApplication<TunedBackendApplication>(*args)
}
