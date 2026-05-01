package com.example.universityeportal.exception;

public class DuplicateUserException extends RuntimeException {
    
    public DuplicateUserException(String username) {
        super("User already exists with username: " + username);
    }
}
