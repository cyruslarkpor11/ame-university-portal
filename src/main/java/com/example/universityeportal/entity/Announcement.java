package com.example.universityeportal.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "announcements")
public class Announcement {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false, length = 2000)
    private String content;
    
    @Enumerated(EnumType.STRING)
    private AnnouncementType type;
    
    @Enumerated(EnumType.STRING)
    private TargetAudience targetAudience;
    
    private String author;
    
    private LocalDateTime publishDate;
    
    private LocalDateTime expiryDate;
    
    private boolean active = true;
    
    private boolean pinned = false;
    
    private int priority; // 1-5, higher is more important
    
    public enum AnnouncementType {
        GENERAL, ACADEMIC, ADMINISTRATIVE, EVENT, EMERGENCY
    }
    
    public enum TargetAudience {
        ALL, STUDENTS, LECTURERS, ADMIN, PUBLIC
    }
    
    public Announcement() {
        this.publishDate = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public AnnouncementType getType() { return type; }
    public void setType(AnnouncementType type) { this.type = type; }
    
    public TargetAudience getTargetAudience() { return targetAudience; }
    public void setTargetAudience(TargetAudience targetAudience) { this.targetAudience = targetAudience; }
    
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    
    public LocalDateTime getPublishDate() { return publishDate; }
    public void setPublishDate(LocalDateTime publishDate) { this.publishDate = publishDate; }
    
    public LocalDateTime getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDateTime expiryDate) { this.expiryDate = expiryDate; }
    
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    
    public boolean isPinned() { return pinned; }
    public void setPinned(boolean pinned) { this.pinned = pinned; }
    
    public int getPriority() { return priority; }
    public void setPriority(int priority) { this.priority = priority; }
}
