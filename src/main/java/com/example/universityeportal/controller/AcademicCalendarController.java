package com.example.universityeportal.controller;

import com.example.universityeportal.dto.ApiResponse;
import com.example.universityeportal.entity.AcademicCalendar;
import com.example.universityeportal.service.AcademicCalendarService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/calendar")
@CrossOrigin(origins = "*")
public class AcademicCalendarController {
    
    private static final Logger logger = LoggerFactory.getLogger(AcademicCalendarController.class);
    
    private final AcademicCalendarService academicCalendarService;
    
    @Autowired
    public AcademicCalendarController(AcademicCalendarService academicCalendarService) {
        this.academicCalendarService = academicCalendarService;
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<AcademicCalendar>>> getAllEvents() {
        logger.info("GET /api/calendar - Fetching all events");
        List<AcademicCalendar> events = academicCalendarService.getAllEvents();
        return ResponseEntity.ok(ApiResponse.success("Events retrieved successfully", events));
    }
    
    @GetMapping("/year/{academicYear}")
    public ResponseEntity<ApiResponse<List<AcademicCalendar>>> getEventsByAcademicYear(
            @PathVariable String academicYear) {
        logger.info("GET /api/calendar/year/{} - Fetching events by academic year", academicYear);
        List<AcademicCalendar> events = academicCalendarService.getEventsByAcademicYear(academicYear);
        return ResponseEntity.ok(ApiResponse.success("Events retrieved successfully", events));
    }
    
    @GetMapping("/semester/{semester}")
    public ResponseEntity<ApiResponse<List<AcademicCalendar>>> getEventsBySemester(
            @PathVariable String semester) {
        logger.info("GET /api/calendar/semester/{} - Fetching events by semester", semester);
        List<AcademicCalendar> events = academicCalendarService.getEventsBySemester(semester);
        return ResponseEntity.ok(ApiResponse.success("Events retrieved successfully", events));
    }
    
    @GetMapping("/range")
    public ResponseEntity<ApiResponse<List<AcademicCalendar>>> getEventsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        logger.info("GET /api/calendar/range - Fetching events between {} and {}", start, end);
        List<AcademicCalendar> events = academicCalendarService.getEventsByDateRange(start, end);
        return ResponseEntity.ok(ApiResponse.success("Events retrieved successfully", events));
    }
    
    @GetMapping("/type/{eventType}")
    public ResponseEntity<ApiResponse<List<AcademicCalendar>>> getEventsByType(
            @PathVariable AcademicCalendar.EventType eventType) {
        logger.info("GET /api/calendar/type/{} - Fetching events by type", eventType);
        List<AcademicCalendar> events = academicCalendarService.getEventsByType(eventType);
        return ResponseEntity.ok(ApiResponse.success("Events retrieved successfully", events));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AcademicCalendar>> getEventById(@PathVariable Long id) {
        logger.info("GET /api/calendar/{} - Fetching event", id);
        AcademicCalendar event = academicCalendarService.getEventById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        return ResponseEntity.ok(ApiResponse.success("Event retrieved successfully", event));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<AcademicCalendar>> createEvent(@RequestBody AcademicCalendar event) {
        logger.info("POST /api/calendar - Creating event: {}", event.getTitle());
        AcademicCalendar createdEvent = academicCalendarService.createEvent(event);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Event created successfully", createdEvent));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AcademicCalendar>> updateEvent(
            @PathVariable Long id,
            @RequestBody AcademicCalendar event) {
        logger.info("PUT /api/calendar/{} - Updating event", id);
        AcademicCalendar updatedEvent = academicCalendarService.updateEvent(id, event);
        return ResponseEntity.ok(ApiResponse.success("Event updated successfully", updatedEvent));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(@PathVariable Long id) {
        logger.info("DELETE /api/calendar/{} - Deleting event", id);
        academicCalendarService.deleteEvent(id);
        return ResponseEntity.ok(ApiResponse.success("Event deleted successfully", null));
    }
}
