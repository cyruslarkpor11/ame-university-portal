package com.example.universityeportal.controller;

import com.example.universityeportal.dto.ApiResponse;
import com.example.universityeportal.dto.LoginRequestDto;
import com.example.universityeportal.dto.LoginResponseDto;
import com.example.universityeportal.dto.UserDto;
import com.example.universityeportal.service.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    
    private final UserService userService;
    
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        logger.info("GET /api/users - Fetching all users");
        List<UserDto> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
    }
    
    @GetMapping("/{username}")
    public ResponseEntity<ApiResponse<UserDto>> getUserByUsername(@PathVariable String username) {
        logger.info("GET /api/users/{} - Fetching user", username);
        UserDto user = userService.getUserByUsername(username);
        return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", user));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<UserDto>> createUser(@Valid @RequestBody UserDto userDto) {
        logger.info("POST /api/users - Creating user: {}", userDto.getUsername());
        UserDto createdUser = userService.createUser(userDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User created successfully", createdUser));
    }
    
    @PutMapping("/{username}")
    public ResponseEntity<ApiResponse<UserDto>> updateUser(
            @PathVariable String username,
            @Valid @RequestBody UserDto userDto) {
        logger.info("PUT /api/users/{} - Updating user", username);
        UserDto updatedUser = userService.updateUser(username, userDto);
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", updatedUser));
    }
    
    @DeleteMapping("/{username}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable String username) {
        logger.info("DELETE /api/users/{} - Deleting user", username);
        userService.deleteUser(username);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponseDto>> login(@Valid @RequestBody LoginRequestDto loginRequest) {
        logger.info("POST /api/users/login - Login attempt for user: {}", loginRequest.getUsername());
        UserDto user = userService.validateLogin(loginRequest.getUsername(), loginRequest.getPassword());
        
        LoginResponseDto response = new LoginResponseDto(
                user.getUsername(),
                user.getRole(),
                "Login successful"
        );
        
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }
}
