package com.example.universityeportal.controller;

import com.example.universityeportal.dto.ApiResponse;
import com.example.universityeportal.entity.Department;
import com.example.universityeportal.service.DepartmentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "*")
public class DepartmentController {
    
    private static final Logger logger = LoggerFactory.getLogger(DepartmentController.class);
    
    private final DepartmentService departmentService;
    
    @Autowired
    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Department>>> getAllDepartments() {
        logger.info("GET /api/departments - Fetching all departments");
        List<Department> departments = departmentService.getAllDepartments();
        return ResponseEntity.ok(ApiResponse.success("Departments retrieved successfully", departments));
    }
    
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<Department>>> getActiveDepartments() {
        logger.info("GET /api/departments/active - Fetching active departments");
        List<Department> departments = departmentService.getActiveDepartments();
        return ResponseEntity.ok(ApiResponse.success("Active departments retrieved successfully", departments));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Department>> getDepartmentById(@PathVariable Long id) {
        logger.info("GET /api/departments/{} - Fetching department", id);
        Department department = departmentService.getDepartmentById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));
        return ResponseEntity.ok(ApiResponse.success("Department retrieved successfully", department));
    }
    
    @GetMapping("/code/{code}")
    public ResponseEntity<ApiResponse<Department>> getDepartmentByCode(@PathVariable String code) {
        logger.info("GET /api/departments/code/{} - Fetching department by code", code);
        Department department = departmentService.getDepartmentByCode(code)
                .orElseThrow(() -> new RuntimeException("Department not found"));
        return ResponseEntity.ok(ApiResponse.success("Department retrieved successfully", department));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<Department>> createDepartment(@RequestBody Department department) {
        logger.info("POST /api/departments - Creating department: {}", department.getCode());
        Department createdDepartment = departmentService.createDepartment(department);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Department created successfully", createdDepartment));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Department>> updateDepartment(
            @PathVariable Long id,
            @RequestBody Department department) {
        logger.info("PUT /api/departments/{} - Updating department", id);
        Department updatedDepartment = departmentService.updateDepartment(id, department);
        return ResponseEntity.ok(ApiResponse.success("Department updated successfully", updatedDepartment));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDepartment(@PathVariable Long id) {
        logger.info("DELETE /api/departments/{} - Deleting department", id);
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok(ApiResponse.success("Department deleted successfully", null));
    }
    
    @GetMapping("/count")
    public ResponseEntity<ApiResponse<Long>> countDepartments() {
        long count = departmentService.countDepartments();
        return ResponseEntity.ok(ApiResponse.success("Department count", count));
    }
}
