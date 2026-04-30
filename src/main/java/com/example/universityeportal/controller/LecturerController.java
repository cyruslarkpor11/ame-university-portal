package com.example.universityeportal.controller;

import com.example.universityeportal.entity.Course;
import com.example.universityeportal.repository.CourseRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/lecturer")
public class LecturerController {

    private final CourseRepository courseRepository;

    public LecturerController(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @PostMapping("/courses")
    public Course createCourse(@RequestBody CourseRequest courseRequest) {
        Objects.requireNonNull(courseRequest, "courseRequest must not be null");

        Course course = new Course();
        course.setName(courseRequest.name());
        course.setDescription(courseRequest.description());
        return courseRepository.save(course);
    }

    @GetMapping("/courses")
    public List<Course> getMyCourses() {
        // In a real app, filter by current lecturer
        return courseRepository.findAll();
    }

    public record CourseRequest(String name, String description, Long lecturerId) {}
}