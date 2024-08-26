package com.tuned.tuned_backend.service

import org.springframework.stereotype.Service
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import java.util.*

object JwtConstants {
    val key = Keys.secretKeyFor(SignatureAlgorithm.HS256)
    val EXPIRATION_TIME = 864_000_000 // 10 days
}
@Service
class JwtService {
    fun generateToken(userId: String): String {
        return try {
            Jwts.builder()
                .setSubject(userId)
                .setIssuedAt(Date())
                .setExpiration(Date(System.currentTimeMillis() + JwtConstants.EXPIRATION_TIME))
                .signWith(JwtConstants.key)
                .compact()
        } catch (e: Exception) {
            e.message ?: "uh oh"
        }
    }

    fun validateTokenAndGetUserId(token: String): String? = try {
        Jwts.parserBuilder().setSigningKey(JwtConstants.key).build().parseClaimsJws(token).body.subject
    } catch (e: Exception) {
        null
    }
}