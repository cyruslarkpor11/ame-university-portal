package com.example.universityeportal.repository;

import com.example.universityeportal.entity.AcademicCalendar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AcademicCalendarRepository extends JpaRepository<AcademicCalendar, Long> {
    
    List<AcademicCalendar> findByAcademicYearAndActiveTrue(String academicYear);
    
    List<AcademicCalendar> findBySemesterAndActiveTrue(String semester);
    
    List<AcademicCalendar> findByStartDateBetweenAndActiveTrue(LocalDate start, LocalDate end);
    
    List<AcademicCalendar> findByEventTypeAndActiveTrue(AcademicCalendar.EventType eventType);
}
