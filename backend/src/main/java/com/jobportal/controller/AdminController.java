package com.jobportal.controller;

import com.jobportal.dto.ApplicationResponse;
import com.jobportal.dto.EmployerApprovalResponse;
import com.jobportal.dto.JobResponse;
import com.jobportal.model.Company;
import com.jobportal.model.Role;
import com.jobportal.model.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.CompanyRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @GetMapping("/jobs")
    public ResponseEntity<List<JobResponse>> getAllJobs() {
        return ResponseEntity.ok(jobRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt")).stream()
                .map(JobResponse::from)
                .toList());
    }

    @GetMapping("/applications")
    public ResponseEntity<List<ApplicationResponse>> getAllApplications() {
        return ResponseEntity.ok(applicationRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt")).stream()
                .map(ApplicationResponse::from)
                .toList());
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/employers/pending")
    public ResponseEntity<List<EmployerApprovalResponse>> getPendingEmployers() {
        List<User> pendingEmployers = userRepository.findAll().stream()
                .filter(user -> user.getRoles().stream()
                        .anyMatch(role -> role.getName() == Role.RoleName.ROLE_EMPLOYER))
                .filter(User::getIsActive)
                .filter(user -> !user.getIsVerified())
                .collect(Collectors.toList());
        return ResponseEntity.ok(pendingEmployers.stream()
                .map(EmployerApprovalResponse::from)
                .toList());
    }

    @PostMapping("/users/{id}/approve")
    public ResponseEntity<?> approveUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsVerified(true);
        userRepository.save(user);
        companyRepository.findByUserId(id).ifPresent(company -> {
            company.setIsVerified(true);
            company.setVerificationStatus(Company.VerificationStatus.APPROVED);
            companyRepository.save(company);
        });
        return ResponseEntity.ok("User approved successfully");
    }

    @PostMapping("/users/{id}/deactivate")
    public ResponseEntity<?> deactivateUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(false);
        userRepository.save(user);
        return ResponseEntity.ok("User deactivated successfully");
    }

    @PostMapping("/users/{id}/reject")
    public ResponseEntity<?> rejectEmployer(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(false);
        userRepository.save(user);
        companyRepository.findByUserId(id).ifPresent(company -> {
            company.setIsVerified(false);
            company.setVerificationStatus(Company.VerificationStatus.REJECTED);
            companyRepository.save(company);
        });
        return ResponseEntity.ok("Employer rejected successfully");
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully");
    }
}
