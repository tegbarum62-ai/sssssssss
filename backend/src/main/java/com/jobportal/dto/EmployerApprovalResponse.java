package com.jobportal.dto;

import com.jobportal.model.User;

public record EmployerApprovalResponse(
        Long id,
        String contactName,
        String email,
        String companyName) {

    public static EmployerApprovalResponse from(User user) {
        return new EmployerApprovalResponse(
                user.getId(),
                user.getFirstName() + " " + user.getLastName(),
                user.getEmail(),
                user.getCompany() == null ? null : user.getCompany().getName());
    }
}
