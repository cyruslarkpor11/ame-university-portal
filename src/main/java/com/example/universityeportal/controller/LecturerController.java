package com.example.universityeportal.controller;

import com.example.universityeportal.entity.Course;
import com.example.universityeportal.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lecturer")
public class LecturerController {

    @Autowired
    private CourseRepository courseRepository;

    @PostMapping("/courses")
    public Course createCourse(@RequestBody Course course) {
        return courseRepository.save(course);
    }

    @GetMapping("/courses")
    public List<Course> getMyCourses() {
        // In a real app, filter by current lecturer
        return courseRepository.findAll();
    }
}