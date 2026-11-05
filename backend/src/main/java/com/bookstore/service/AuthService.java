package com.bookstore.service;

import com.bookstore.dto.LoginRequest;
import com.bookstore.dto.LoginResponse;
import com.bookstore.dto.RegisterRequest;
import com.bookstore.entity.User;
import com.bookstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;

    public LoginResponse login(LoginRequest request) {
        String identifier = request.getUsernameOrEmail().trim();
        Optional<User> userOpt = userRepository.findByUsername(identifier)
                .or(() -> userRepository.findByEmail(identifier));

        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with username/email: " + identifier);
        }

        User user = userOpt.get();
        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid password credentials");
        }

        String mockToken = "token_" + UUID.randomUUID().toString().replace("-", "");

        return LoginResponse.builder()
                .token(mockToken)
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .giftPoints(user.getGiftPoints())
                .role(user.getRole())
                .build();
    }

    public LoginResponse register(RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username is already taken");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already registered");
        }

        User newUser = User.builder()
                .username(request.getUsername().trim())
                .email(request.getEmail().trim().toLowerCase())
                .password(request.getPassword())
                .fullName(request.getFullName().trim())
                .phone(request.getPhone())
                .giftPoints(100) // Welcome bonus points
                .role("ROLE_USER")
                .build();

        User saved = userRepository.save(newUser);
        return login(new LoginRequest() {{
            setUsernameOrEmail(saved.getUsername());
            setPassword(saved.getPassword());
        }});
    }

    public User getUserProfile(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }
}
