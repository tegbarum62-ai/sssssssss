package com.jobportal.controller;

import com.jobportal.dto.JobResponse;
import com.jobportal.model.Company;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.repository.CompanyRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/jobs")
@CrossOrigin(origins = "*", maxAge = 3600)
public class JobController {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<Page<JobResponse>> getAllJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        Page<Job> jobs = jobRepository.findActiveJobs(pageable);
        return ResponseEntity.ok(jobs.map(JobResponse::from));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getJobById(@PathVariable Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        job.setViewCount(job.getViewCount() + 1);
        Job viewedJob = jobRepository.save(job);
        return ResponseEntity.ok(JobResponse.from(viewedJob));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<JobResponse>> searchJobs(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Job> jobs = jobRepository.searchJobs(keyword, pageable);
        return ResponseEntity.ok(jobs.map(JobResponse::from));
    }

    @GetMapping("/search/advanced")
    public ResponseEntity<Page<JobResponse>> advancedSearch(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Job.JobType jobType,
            @RequestParam(required = false) Job.WorkMode workMode,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Job> jobs = jobRepository.advancedSearch(location, jobType, workMode, category, pageable);
        return ResponseEntity.ok(jobs.map(JobResponse::from));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('EMPLOYER', 'ADMIN')")
    public ResponseEntity<JobResponse> createJob(@RequestBody Job job, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!user.getIsVerified()) {
            return ResponseEntity.status(403).build();
        }

        Company company = companyRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Employer company profile not found"));
        job.setCompany(company);
        job.setStatus(Job.JobStatus.OPEN);
        job.setIsActive(true);
        if (job.getApplicationCount() == null) {
            job.setApplicationCount(0);
        }
        if (job.getViewCount() == null) {
            job.setViewCount(0);
        }
        if (job.getOpenings() == null || job.getOpenings() < 1) {
            job.setOpenings(1);
        }
        job.setPublishedAt(java.time.LocalDateTime.now());
        Job savedJob = jobRepository.save(job);
        return ResponseEntity.ok(JobResponse.from(savedJob));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('EMPLOYER', 'ADMIN')")
    public ResponseEntity<?> updateJob(@PathVariable Long id, @RequestBody Job jobDetails) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        job.setTitle(jobDetails.getTitle());
        job.setDescription(jobDetails.getDescription());
        job.setLocation(jobDetails.getLocation());
        job.setJobType(jobDetails.getJobType());
        job.setSalaryMin(jobDetails.getSalaryMin());
        job.setSalaryMax(jobDetails.getSalaryMax());

        Job updatedJob = jobRepository.save(job);
        return ResponseEntity.ok(updatedJob);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('EMPLOYER', 'ADMIN')")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        jobRepository.delete(job);
        return ResponseEntity.ok("Job deleted successfully");
    }
}
