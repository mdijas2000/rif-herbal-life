package com.rifherballife.backend.controller;

import com.rifherballife.backend.model.*;
import com.rifherballife.backend.repository.*;
import com.rifherballife.backend.security.*;
import lombok.*;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Data
    static class AuthRequest {
        private String username;
        private String password;
    }

    @Data
    static class RegisterRequest {
        private String username;
        private String password;
        private String role; // "ROLE_ADMIN" or "ROLE_USER"
        private String fullName;
        private String email;
        private String mobileNumber;
        private String address;
        private String city;
        private String pincode;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        if (req.getUsername().contains(" ")) {
            return ResponseEntity.badRequest().body("Username cannot contain spaces");
        }
        if (userRepository.existsByUsername(req.getUsername())) {
            return ResponseEntity.badRequest().body("Username already taken");
        }
        Role role;
        try {
            role = Role.valueOf(req.getRole());
        } catch (Exception e) {
            role = Role.ROLE_USER;
        }
        User user = User.builder()
                .username(req.getUsername())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(role)
                .fullName(req.getFullName())
                .email(req.getEmail())
                .mobileNumber(req.getMobileNumber())
                .address(req.getAddress())
                .city(req.getCity())
                .pincode(req.getPincode())
                .build();
        userRepository.save(user);
        return ResponseEntity.ok(java.util.Collections.singletonMap("message", "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authReq) {
        try {
            @SuppressWarnings("unused")
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authReq.getUsername(), authReq.getPassword()));

            User user = userRepository.findByUsername(authReq.getUsername()).orElseThrow();
            String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
            return ResponseEntity.ok(new LoginResponse(token, user.getUsername(), user.getRole().name()));
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        // Return user details sans password ideally, but here we return full object.
        // Ensure to handle password visibility in User entity or DTO in production.
        return ResponseEntity.ok(user);
    }

    @Data
    @AllArgsConstructor
    static class LoginResponse {
        private String token;
        private String username;
        private String role;
    }
}
