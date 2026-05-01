package com.example.universityeportal.controller;

import com.example.universityeportal.entity.Course;
import com.example.universityeportal.entity.User;
import com.example.universityeportal.repository.CourseRepository;
import com.example.universityeportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "*")
public class StudentController {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/courses")
    public List<Course> getCourses() {
        return courseRepository.findAll();
    }

    @GetMapping("/profile")
    public User getProfile(Authentication authentication) {
        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("Student account not found"));
    }

    @PostMapping("/enroll/{courseId}")
    public String enroll(Authentication authentication, @PathVariable Long courseId) {
        User student = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("Student account not found"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + courseId));

        return String.format("Student %s enrolled in course %s", student.getUsername(), course.getName());
    }
}