package com.tuned.tuned_backend.repository

import com.tuned.tuned_backend.model.User
import org.springframework.data.jpa.repository.JpaRepository

interface UserRepository : JpaRepository<User, String>