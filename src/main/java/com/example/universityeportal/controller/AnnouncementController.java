package com.example.universityeportal.controller;

import com.example.universityeportal.dto.ApiResponse;
import com.example.universityeportal.entity.Announcement;
import com.example.universityeportal.service.AnnouncementService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
@CrossOrigin(origins = "*")
public class AnnouncementController {
    
    private static final Logger logger = LoggerFactory.getLogger(AnnouncementController.class);
    
    private final AnnouncementService announcementService;
    
    @Autowired
    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Announcement>>> getAllAnnouncements() {
        logger.info("GET /api/announcements - Fetching all announcements");
        List<Announcement> announcements = announcementService.getAllAnnouncements();
        return ResponseEntity.ok(ApiResponse.success("Announcements retrieved successfully", announcements));
    }
    
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<Announcement>>> getActiveAnnouncements() {
        logger.info("GET /api/announcements/active - Fetching active announcements");
        List<Announcement> announcements = announcementService.getActiveAnnouncements();
        return ResponseEntity.ok(ApiResponse.success("Active announcements retrieved successfully", announcements));
    }
    
    @GetMapping("/audience/{audience}")
    public ResponseEntity<ApiResponse<List<Announcement>>> getAnnouncementsByAudience(
            @PathVariable Announcement.TargetAudience audience) {
        logger.info("GET /api/announcements/audience/{} - Fetching announcements by audience", audience);
        List<Announcement> announcements = announcementService.getAnnouncementsByAudience(audience);
        return ResponseEntity.ok(ApiResponse.success("Announcements retrieved successfully", announcements));
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<ApiResponse<List<Announcement>>> getAnnouncementsByType(
            @PathVariable Announcement.AnnouncementType type) {
        logger.info("GET /api/announcements/type/{} - Fetching announcements by type", type);
        List<Announcement> announcements = announcementService.getAnnouncementsByType(type);
        return ResponseEntity.ok(ApiResponse.success("Announcements retrieved successfully", announcements));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Announcement>> getAnnouncementById(@PathVariable Long id) {
        logger.info("GET /api/announcements/{} - Fetching announcement", id);
        Announcement announcement = announcementService.getAnnouncementById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));
        return ResponseEntity.ok(ApiResponse.success("Announcement retrieved successfully", announcement));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<Announcement>> createAnnouncement(@RequestBody Announcement announcement) {
        logger.info("POST /api/announcements - Creating announcement: {}", announcement.getTitle());
        Announcement createdAnnouncement = announcementService.createAnnouncement(announcement);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Announcement created successfully", createdAnnouncement));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Announcement>> updateAnnouncement(
            @PathVariable Long id,
            @RequestBody Announcement announcement) {
        logger.info("PUT /api/announcements/{} - Updating announcement", id);
        Announcement updatedAnnouncement = announcementService.updateAnnouncement(id, announcement);
        return ResponseEntity.ok(ApiResponse.success("Announcement updated successfully", updatedAnnouncement));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAnnouncement(@PathVariable Long id) {
        logger.info("DELETE /api/announcements/{} - Deleting announcement", id);
        announcementService.deleteAnnouncement(id);
        return ResponseEntity.ok(ApiResponse.success("Announcement deleted successfully", null));
    }
}
