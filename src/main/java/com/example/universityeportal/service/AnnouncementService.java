package com.example.universityeportal.service;

import com.example.universityeportal.entity.Announcement;
import com.example.universityeportal.repository.AnnouncementRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@SuppressWarnings("null")
public class AnnouncementService {
    
    private static final Logger logger = LoggerFactory.getLogger(AnnouncementService.class);
    
    private final AnnouncementRepository announcementRepository;
    
    @Autowired
    public AnnouncementService(AnnouncementRepository announcementRepository) {
        this.announcementRepository = announcementRepository;
    }
    
    public List<Announcement> getAllAnnouncements() {
        logger.debug("Fetching all announcements");
        return announcementRepository.findAll();
    }
    
    public List<Announcement> getActiveAnnouncements() {
        logger.debug("Fetching active announcements");
        return announcementRepository.findActiveAnnouncements(LocalDateTime.now());
    }
    
    public List<Announcement> getAnnouncementsByAudience(Announcement.TargetAudience audience) {
        logger.debug("Fetching announcements for audience: {}", audience);
        return announcementRepository.findByTargetAudienceAndActiveTrue(audience);
    }
    
    public List<Announcement> getAnnouncementsByType(Announcement.AnnouncementType type) {
        logger.debug("Fetching announcements by type: {}", type);
        return announcementRepository.findByTypeAndActiveTrue(type);
    }
    
    public Optional<Announcement> getAnnouncementById(Long id) {
        logger.debug("Fetching announcement by id: {}", id);
        return announcementRepository.findById(id);
    }
    
    public Announcement createAnnouncement(Announcement announcement) {
        logger.info("Creating new announcement: {}", announcement.getTitle());
        
        if (announcement.getPublishDate() == null) {
            announcement.setPublishDate(LocalDateTime.now());
        }
        
        Announcement savedAnnouncement = announcementRepository.save(announcement);
        logger.info("Announcement created successfully: {}", savedAnnouncement.getId());
        return savedAnnouncement;
    }
    
    public Announcement updateAnnouncement(Long id, Announcement announcementDetails) {
        logger.info("Updating announcement: {}", id);
        
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found with id: " + id));
        
        announcement.setTitle(announcementDetails.getTitle());
        announcement.setContent(announcementDetails.getContent());
        announcement.setType(announcementDetails.getType());
        announcement.setTargetAudience(announcementDetails.getTargetAudience());
        announcement.setExpiryDate(announcementDetails.getExpiryDate());
        announcement.setActive(announcementDetails.isActive());
        announcement.setPinned(announcementDetails.isPinned());
        announcement.setPriority(announcementDetails.getPriority());
        
        Announcement updatedAnnouncement = announcementRepository.save(announcement);
        logger.info("Announcement updated successfully: {}", id);
        return updatedAnnouncement;
    }
    
    public void deleteAnnouncement(Long id) {
        logger.info("Deleting announcement: {}", id);
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found with id: " + id));
        announcement.setActive(false);
        announcementRepository.save(announcement);
        logger.info("Announcement deactivated successfully: {}", id);
    }
    
    public long countAnnouncements() {
        return announcementRepository.count();
    }
}
