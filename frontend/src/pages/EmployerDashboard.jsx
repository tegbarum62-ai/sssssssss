import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api';

const EmployerDashboard = () => {
    const [stats, setStats] = useState({
        totalPosted: 0,
        activeJobs: 0,
        closedJobs: 0,
        totalApplicants: 0,
        shortlistedCount: 0,
        interviewsScheduled: 0
    });
    const [recentApplicants, setRecentApplicants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            apiRequest('/employer/stats'),
            apiRequest('/employer/applications')
        ])
            .then(([statsData, appsData]) => {
                if (statsData) setStats(statsData);
                if (appsData) setRecentApplicants(appsData.slice(0, 5));
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <DashboardLayout role="employer">
            {/* Stats Row */}
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon blue">
                            <i className="bi bi-briefcase"></i>
                        </div>
                        <div className="stat-value">{stats.totalPosted}</div>
                        <div className="stat-label">Total Jobs Posted</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon green">
                            <i className="bi bi-check-circle"></i>
                        </div>
                        <div className="stat-value">{stats.activeJobs}</div>
                        <div className="stat-label">Active Listings</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon orange">
                            <i className="bi bi-people"></i>
                        </div>
                        <div className="stat-value">{stats.totalApplicants}</div>
                        <div className="stat-label">Total Applicants</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon teal">
                            <i className="bi bi-calendar-check"></i>
                        </div>
                        <div className="stat-value">{stats.interviewsScheduled || 0}</div>
                        <div className="stat-label">Interviews Scheduled</div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Recent Applicants */}
                <div className="col-lg-8">
                    <div className="content-card h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="content-title mb-0">Recent Candidate Applications</h5>
                            <Link to="/dashboard/employer/applications" className="btn btn-sm btn-outline-primary">
                                View All Applicants
                            </Link>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Applicant</th>
                                        <th>Role Applied</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentApplicants.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-4 text-muted">
                                                No applicant submissions yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        recentApplicants.map(app => (
                                            <tr key={app.id}>
                                                <td>
                                                    <div className="fw-bold text-dark">{app.applicantName}</div>
                                                    <div className="text-muted small">{app.applicantEmail}</div>
                                                </td>
                                                <td>
                                                    <span className="fw-semibold">{app.jobTitle}</span>
                                                </td>
                                                <td>
                                                    <span
                                                        className={`badge rounded-pill ${
                                                            app.status === 'SHORTLISTED'
                                                                ? 'bg-success'
                                                                : app.status === 'INTERVIEW_SCHEDULED'
                                                                ? 'bg-info text-dark'
                                                                : app.status === 'REJECTED'
                                                                ? 'bg-danger'
                                                                : 'bg-primary'
                                                        }`}
                                                    >
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td className="small text-muted">{app.appliedDate || app.appliedAt}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="col-lg-4">
                    <div className="content-card h-100">
                        <h5 className="content-title mb-3">Recruiting Shortcuts</h5>
                        <div className="d-grid gap-3">
                            <Link to="/dashboard/employer/post-job" className="btn btn-teal text-white py-3 text-start d-flex align-items-center">
                                <i className="bi bi-plus-circle-fill fs-4 me-3"></i>
                                <div>
                                    <div className="fw-bold">Post Any Job</div>
                                    <small className="opacity-75">Publish unlimited custom roles</small>
                                </div>
                            </Link>

                            <Link to="/dashboard/employer/jobs" className="btn btn-outline-primary py-3 text-start d-flex align-items-center">
                                <i className="bi bi-list-task fs-4 me-3"></i>
                                <div>
                                    <div className="fw-bold">Manage Active Postings</div>
                                    <small className="text-muted">Edit details or close listings</small>
                                </div>
                            </Link>

                            <Link to="/dashboard/employer/applications" className="btn btn-outline-success py-3 text-start d-flex align-items-center">
                                <i className="bi bi-calendar2-week-fill fs-4 me-3"></i>
                                <div>
                                    <div className="fw-bold">Interview Pipeline</div>
                                    <small className="text-muted">Review & schedule interviews</small>
                                </div>
                            </Link>

                            <Link to="/dashboard/employer/profile" className="btn btn-outline-secondary py-3 text-start d-flex align-items-center">
                                <i className="bi bi-building-gear fs-4 me-3"></i>
                                <div>
                                    <div className="fw-bold">Company Profile</div>
                                    <small className="text-muted">Update contact and branding</small>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default EmployerDashboard;
