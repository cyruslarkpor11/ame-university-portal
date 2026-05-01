package com.example.universityeportal.controller;

import com.example.universityeportal.entity.User;
import com.example.universityeportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // Get all users
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get user by username
    @GetMapping("/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        Optional<User> user = userRepository.findByUsername(username);
        return user.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Create new user
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    // Update user
    @PutMapping("/{username}")
    public ResponseEntity<User> updateUser(@PathVariable String username, @RequestBody User userDetails) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = userOpt.get();
        user.setEmail(userDetails.getEmail());
        user.setRole(userDetails.getRole());
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(userDetails.getPassword());
        }
        
        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(updatedUser);
    }

    // Delete user
    @DeleteMapping("/{username}")
    public ResponseEntity<Void> deleteUser(@PathVariable String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            userRepository.delete(userOpt.get());
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Validate login
    @PostMapping("/login")
    public ResponseEntity<?> validateLogin(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        
        User user = userOpt.get();
        if (user.getPassword().equals(request.getPassword())) {
            return ResponseEntity.ok(new LoginResponse(user.getUsername(), user.getRole().name()));
        }
        
        return ResponseEntity.badRequest().body("Invalid password");
    }
}

class LoginRequest {
    private String username;
    private String password;
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

class LoginResponse {
    private String username;
    private String role;
    
    public LoginResponse(String username, String role) {
        this.username = username;
        this.role = role;
    }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
