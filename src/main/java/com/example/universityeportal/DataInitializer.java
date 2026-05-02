package com.example.universityeportal;

import com.example.universityeportal.entity.Course;
import com.example.universityeportal.entity.Role;
import com.example.universityeportal.entity.User;
import com.example.universityeportal.repository.CourseRepository;
import com.example.universityeportal.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           CourseRepository courseRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Create default users with correct passwords
        createOrUpdateUser("student", "student123", "student@example.com", Role.STUDENT);
        createOrUpdateUser("lecturer", "lecturer123", "lecturer@example.com", Role.LECTURER);
        createOrUpdateUser("admin", "admin123", "admin@example.com", Role.ADMIN);
        
        System.out.println("========================================");
        System.out.println("  DEFAULT USERS CREATED:");
        System.out.println("========================================");
        System.out.println("  Admin:     admin / admin123");
        System.out.println("  Lecturer:  lecturer / lecturer123");
        System.out.println("  Student:   student / student123");
        System.out.println("========================================");

        if (courseRepository.count() == 0) {
            Course course1 = new Course();
            course1.setName("Introduction to Programming");
            course1.setDescription("Basic programming concepts");
            courseRepository.save(course1);

            Course course2 = new Course();
            course2.setName("Data Structures");
            course2.setDescription("Data structures and algorithms");
            courseRepository.save(course2);

            Course course3 = new Course();
            course3.setName("Database Systems");
            course3.setDescription("Relational database design");
            courseRepository.save(course3);
        }
    }

    private void createOrUpdateUser(String username, String rawPassword, String email, Role role) {
        userRepository.findByUsername(username).ifPresentOrElse(existing -> {
            existing.setPassword(passwordEncoder.encode(rawPassword));
            existing.setEmail(email);
            existing.setRole(role);
            userRepository.save(existing);
        }, () -> {
            User user = new User(username, passwordEncoder.encode(rawPassword), email, role);
            userRepository.save(user);
        });
    }
}
