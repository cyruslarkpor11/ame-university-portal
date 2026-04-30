package com.example.universityeportal.controller;

import com.example.universityeportal.entity.Course;
import com.example.universityeportal.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    private CourseRepository courseRepository;

    @GetMapping("/courses")
    public List<Course> getCourses() {
        return courseRepository.findAll();
    }

    @PostMapping("/enroll/{courseId}")
    public String enroll(@PathVariable Long courseId) {
        // Logic to enroll student in course
        return "Enrolled in course " + courseId;
    }
}