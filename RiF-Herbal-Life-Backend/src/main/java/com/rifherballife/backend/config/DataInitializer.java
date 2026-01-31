package com.rifherballife.backend.config;

import com.rifherballife.backend.model.*;
import com.rifherballife.backend.model.Role;
import com.rifherballife.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

        @Bean
        CommandLineRunner init(UserRepository userRepository, ProductRepository productRepository,
                        PasswordEncoder encoder) {
                return args -> {
                        // Create admin user
                        if (!userRepository.existsByUsername("admin")) {
                                User admin = User.builder()
                                                .username("admin")
                                                .password(encoder.encode("admin123"))
                                                .role(Role.ROLE_ADMIN)
                                                .build();
                                userRepository.save(admin);
                                System.out.println("Admin user created -> username: admin password: admin123");
                        }

                        // Create regular user
                        if (!userRepository.existsByUsername("user")) {
                                User user = User.builder()
                                                .username("user")
                                                .password(encoder.encode("user123"))
                                                .role(Role.ROLE_USER)
                                                .build();
                                userRepository.save(user);
                                System.out.println("Regular user created -> username: user password: user123");
                        }

                        // Keep existing fowmi admin
                        if (!userRepository.existsByUsername("fowmi")) {
                                User admin = User.builder()
                                                .username("fowmi")
                                                .password(encoder.encode("fowmi@123"))
                                                .role(Role.ROLE_ADMIN)
                                                .build();
                                userRepository.save(admin);
                                System.out.println("Fowmi admin created -> username: fowmi password: fowmi@123");
                        }

                        // Initialize sample products with stock if database is empty
                        // if (productRepository.count() == 0) {
                        // System.out.println("Sample products seeding disabled.");
                        // }
                };
        }
}
