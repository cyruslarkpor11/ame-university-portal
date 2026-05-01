package com.example.universityeportal.service;

import com.example.universityeportal.dto.ApiResponse;
import com.example.universityeportal.entity.Department;
import com.example.universityeportal.exception.DuplicateUserException;
import com.example.universityeportal.repository.DepartmentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class DepartmentService {
    
    private static final Logger logger = LoggerFactory.getLogger(DepartmentService.class);
    
    private final DepartmentRepository departmentRepository;
    
    @Autowired
    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }
    
    public List<Department> getAllDepartments() {
        logger.debug("Fetching all departments");
        return departmentRepository.findAll();
    }
    
    public List<Department> getActiveDepartments() {
        return departmentRepository.findAll().stream()
                .filter(Department::isActive)
                .toList();
    }
    
    public Optional<Department> getDepartmentById(Long id) {
        logger.debug("Fetching department by id: {}", id);
        return departmentRepository.findById(id);
    }
    
    public Optional<Department> getDepartmentByCode(String code) {
        logger.debug("Fetching department by code: {}", code);
        return departmentRepository.findByCode(code);
    }
    
    public Department createDepartment(Department department) {
        logger.info("Creating new department: {}", department.getCode());
        
        if (departmentRepository.existsByCode(department.getCode())) {
            logger.warn("Department with code {} already exists", department.getCode());
            throw new DuplicateUserException("Department code already exists: " + department.getCode());
        }
        
        Department savedDepartment = departmentRepository.save(department);
        logger.info("Department created successfully: {}", savedDepartment.getCode());
        return savedDepartment;
    }
    
    public Department updateDepartment(Long id, Department departmentDetails) {
        logger.info("Updating department: {}", id);
        
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + id));
        
        department.setName(departmentDetails.getName());
        department.setDescription(departmentDetails.getDescription());
        department.setHeadOfDepartment(departmentDetails.getHeadOfDepartment());
        department.setEmail(departmentDetails.getEmail());
        department.setPhone(departmentDetails.getPhone());
        department.setLocation(departmentDetails.getLocation());
        department.setActive(departmentDetails.isActive());
        
        Department updatedDepartment = departmentRepository.save(department);
        logger.info("Department updated successfully: {}", id);
        return updatedDepartment;
    }
    
    public void deleteDepartment(Long id) {
        logger.info("Deleting department: {}", id);
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + id));
        department.setActive(false);
        departmentRepository.save(department);
        logger.info("Department deactivated successfully: {}", id);
    }
    
    public long countDepartments() {
        return departmentRepository.count();
    }
}
