package com.example.universityeportal.service;

import com.example.universityeportal.entity.AcademicCalendar;
import com.example.universityeportal.repository.AcademicCalendarRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AcademicCalendarService {
    
    private static final Logger logger = LoggerFactory.getLogger(AcademicCalendarService.class);
    
    private final AcademicCalendarRepository academicCalendarRepository;
    
    @Autowired
    public AcademicCalendarService(AcademicCalendarRepository academicCalendarRepository) {
        this.academicCalendarRepository = academicCalendarRepository;
    }
    
    public List<AcademicCalendar> getAllEvents() {
        logger.debug("Fetching all academic calendar events");
        return academicCalendarRepository.findAll();
    }
    
    public List<AcademicCalendar> getEventsByAcademicYear(String academicYear) {
        logger.debug("Fetching events for academic year: {}", academicYear);
        return academicCalendarRepository.findByAcademicYearAndActiveTrue(academicYear);
    }
    
    public List<AcademicCalendar> getEventsBySemester(String semester) {
        logger.debug("Fetching events for semester: {}", semester);
        return academicCalendarRepository.findBySemesterAndActiveTrue(semester);
    }
    
    public List<AcademicCalendar> getEventsByDateRange(LocalDate start, LocalDate end) {
        logger.debug("Fetching events between {} and {}", start, end);
        return academicCalendarRepository.findByStartDateBetweenAndActiveTrue(start, end);
    }
    
    public List<AcademicCalendar> getEventsByType(AcademicCalendar.EventType eventType) {
        logger.debug("Fetching events by type: {}", eventType);
        return academicCalendarRepository.findByEventTypeAndActiveTrue(eventType);
    }
    
    public Optional<AcademicCalendar> getEventById(Long id) {
        logger.debug("Fetching event by id: {}", id);
        return academicCalendarRepository.findById(id);
    }
    
    public AcademicCalendar createEvent(AcademicCalendar event) {
        logger.info("Creating new academic calendar event: {}", event.getTitle());
        AcademicCalendar savedEvent = academicCalendarRepository.save(event);
        logger.info("Event created successfully: {}", savedEvent.getId());
        return savedEvent;
    }
    
    public AcademicCalendar updateEvent(Long id, AcademicCalendar eventDetails) {
        logger.info("Updating event: {}", id);
        
        AcademicCalendar event = academicCalendarRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
        
        event.setAcademicYear(eventDetails.getAcademicYear());
        event.setSemester(eventDetails.getSemester());
        event.setEventType(eventDetails.getEventType());
        event.setTitle(eventDetails.getTitle());
        event.setDescription(eventDetails.getDescription());
        event.setStartDate(eventDetails.getStartDate());
        event.setEndDate(eventDetails.getEndDate());
        event.setActive(eventDetails.isActive());
        
        AcademicCalendar updatedEvent = academicCalendarRepository.save(event);
        logger.info("Event updated successfully: {}", id);
        return updatedEvent;
    }
    
    public void deleteEvent(Long id) {
        logger.info("Deleting event: {}", id);
        AcademicCalendar event = academicCalendarRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
        event.setActive(false);
        academicCalendarRepository.save(event);
        logger.info("Event deactivated successfully: {}", id);
    }
    
    public long countEvents() {
        return academicCalendarRepository.count();
    }
}
