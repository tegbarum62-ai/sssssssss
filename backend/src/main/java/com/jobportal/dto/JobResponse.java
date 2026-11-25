package com.jobportal.dto;

import com.jobportal.model.Job;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record JobResponse(
        Long id,
        String title,
        String description,
        String requirements,
        String location,
        Job.JobType jobType,
        Job.WorkMode workMode,
        String category,
        String skillsRequired,
        BigDecimal salaryMin,
        BigDecimal salaryMax,
        LocalDate applicationDeadline,
        Boolean isActive,
        Job.JobStatus status,
        Integer applicationCount,
        LocalDateTime createdAt,
        String companyName) {

    public static JobResponse from(Job job) {
        return new JobResponse(
                job.getId(),
                job.getTitle(),
                job.getDescription(),
                job.getRequirements(),
                job.getLocation(),
                job.getJobType(),
                job.getWorkMode(),
                job.getCategory(),
                job.getSkillsRequired(),
                job.getSalaryMin(),
                job.getSalaryMax(),
                job.getApplicationDeadline(),
                job.getIsActive(),
                job.getStatus(),
                job.getApplicationCount(),
                job.getCreatedAt(),
                job.getCompany() == null ? null : job.getCompany().getName());
    }
}
