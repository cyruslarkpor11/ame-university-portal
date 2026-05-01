package com.example.universityeportal.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "academic_calendar")
public class AcademicCalendar {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String academicYear;
    
    @Column(nullable = false)
    private String semester;
    
    @Enumerated(EnumType.STRING)
    private EventType eventType;
    
    private String title;
    
    @Column(length = 1000)
    private String description;
    
    private LocalDate startDate;
    
    private LocalDate endDate;
    
    private boolean active = true;
    
    public enum EventType {
        REGISTRATION, ORIENTATION, CLASSES_START, ADD_DROP,
        EXAMINATION, GRADES_DUE, GRADUATION, HOLIDAY, BREAK, OTHER
    }
    
    public AcademicCalendar() {}
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }
    
    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }
    
    public EventType getEventType() { return eventType; }
    public void setEventType(EventType eventType) { this.eventType = eventType; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
