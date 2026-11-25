package com.jobportal.dto;

import com.jobportal.model.Application;

import java.time.LocalDateTime;

public record ApplicationResponse(
        Long id,
        Long jobId,
        String jobTitle,
        String companyName,
        String applicantName,
        String applicantEmail,
        LocalDateTime createdAt,
        Application.ApplicationStatus status) {

    public static ApplicationResponse from(Application application) {
        return new ApplicationResponse(
                application.getId(),
                application.getJob().getId(),
                application.getJob().getTitle(),
                application.getJob().getCompany() == null ? null : application.getJob().getCompany().getName(),
                application.getApplicant().getFirstName() + " " + application.getApplicant().getLastName(),
                application.getApplicant().getEmail(),
                application.getCreatedAt(),
                application.getStatus());
    }
}
