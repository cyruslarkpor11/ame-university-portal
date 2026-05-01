package com.example.universityeportal.repository;

import com.example.universityeportal.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    
    List<Announcement> findByActiveTrueOrderByPinnedDescPriorityDescPublishDateDesc();
    
    List<Announcement> findByTargetAudienceAndActiveTrue(Announcement.TargetAudience audience);
    
    List<Announcement> findByTypeAndActiveTrue(Announcement.AnnouncementType type);
    
    @Query("SELECT a FROM Announcement a WHERE a.active = true AND a.expiryDate > :now ORDER BY a.pinned DESC, a.priority DESC, a.publishDate DESC")
    List<Announcement> findActiveAnnouncements(LocalDateTime now);
}
