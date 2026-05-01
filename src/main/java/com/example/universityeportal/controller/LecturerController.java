package com.example.universityeportal.controller;

import com.example.universityeportal.entity.Course;
import com.example.universityeportal.entity.User;
import com.example.universityeportal.repository.CourseRepository;
import com.example.universityeportal.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/lecturer")
@CrossOrigin(origins = "*")
public class LecturerController {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public LecturerController(CourseRepository courseRepository, UserRepository userRepository) {
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/courses")
    public Course createCourse(Authentication authentication, @RequestBody CourseRequest courseRequest) {
        Objects.requireNonNull(courseRequest, "courseRequest must not be null");

        User lecturer = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("Lecturer account not found"));

        Course course = new Course();
        course.setName(courseRequest.name());
        course.setDescription(courseRequest.description());
        course.setLecturer(lecturer);
        return courseRepository.save(course);
    }

    @GetMapping("/courses")
    public List<Course> getMyCourses(Authentication authentication) {
        User lecturer = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("Lecturer account not found"));
        return courseRepository.findByLecturerId(lecturer.getId());
    }

    @GetMapping("/profile")
    public User getProfile(Authentication authentication) {
        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("Lecturer account not found"));
    }

    public record CourseRequest(String name, String description, Long lecturerId) {}
}