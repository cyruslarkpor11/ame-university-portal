package com.example.universityeportal.service;

import com.example.universityeportal.dto.UserDto;
import com.example.universityeportal.entity.User;
import com.example.universityeportal.exception.DuplicateUserException;
import com.example.universityeportal.exception.InvalidCredentialsException;
import com.example.universityeportal.exception.UserNotFoundException;
import com.example.universityeportal.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@SuppressWarnings("null")
public class UserService {
    
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    public List<UserDto> getAllUsers() {
        logger.debug("Fetching all users");
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public UserDto getUserByUsername(String username) {
        logger.debug("Fetching user by username: {}", username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(username));
        return convertToDto(user);
    }
    
    public Optional<UserDto> findByUsername(String username) {
        logger.debug("Finding user by username: {}", username);
        return userRepository.findByUsername(username)
                .map(this::convertToDto);
    }
    
    public boolean existsByUsername(String username) {
        return userRepository.findByUsername(username).isPresent();
    }
    
    public UserDto createUser(UserDto userDto) {
        logger.info("Creating new user: {}", userDto.getUsername());
        
        if (existsByUsername(userDto.getUsername())) {
            logger.warn("Attempted to create duplicate user: {}", userDto.getUsername());
            throw new DuplicateUserException(userDto.getUsername());
        }
        
        User user = convertToEntity(userDto);
        if (userDto.getPassword() != null && !userDto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        }
        User savedUser = userRepository.save(user);
        
        logger.info("User created successfully: {}", savedUser.getUsername());
        return convertToDto(savedUser);
    }
    
    public UserDto updateUser(String username, UserDto userDto) {
        logger.info("Updating user: {}", username);
        
        User existingUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(username));
        
        existingUser.setEmail(userDto.getEmail());
        if (userDto.getRole() != null) {
            existingUser.setRole(com.example.universityeportal.entity.Role.valueOf(userDto.getRole()));
        }
        if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(userDto.getPassword()));
        }
        
        User updatedUser = userRepository.save(existingUser);
        logger.info("User updated successfully: {}", username);
        return convertToDto(updatedUser);
    }
    
    public void deleteUser(String username) {
        logger.info("Deleting user: {}", username);
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(username));
        
        userRepository.delete(user);
        logger.info("User deleted successfully: {}", username);
    }
    
    public UserDto validateLogin(String username, String password) {
        logger.debug("Validating login for user: {}", username);
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    logger.warn("Login failed - user not found: {}", username);
                    return new InvalidCredentialsException();
                });
        
        if (!passwordEncoder.matches(password, user.getPassword())) {
            logger.warn("Login failed - invalid password for user: {}", username);
            throw new InvalidCredentialsException();
        }
        
        logger.info("Login successful for user: {}", username);
        return convertToDto(user);
    }
    
    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());
        return dto;
    }
    
    private User convertToEntity(UserDto dto) {
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setRole(com.example.universityeportal.entity.Role.valueOf(dto.getRole()));
        return user;
    }
}
