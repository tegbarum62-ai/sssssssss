import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api';

const JobSeekerDashboard = () => {
    const [analytics, setAnalytics] = useState({
        totalApplications: 0,
        shortlistedCount: 0,
        interviewsScheduled: 0,
        underReviewCount: 0,
        rejectedCount: 0,
        profileStrength: 85,
        savedCVsCount: 1,
        activeJobAlertsCount: 4
    });
    const [myApplications, setMyApplications] = useState([]);
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            apiRequest('/jobseeker/analytics'),
            apiRequest('/applications/my-applications'),
            apiRequest('/jobs?size=4')
        ])
            .then(([analyticsData, appsData, jobsData]) => {
                if (analyticsData) setAnalytics(analyticsData);
                if (appsData) setMyApplications(appsData);
                if (jobsData && jobsData.content) setRecommendedJobs(jobsData.content.slice(0, 3));
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const interviewRate = analytics.totalApplications > 0
        ? Math.round((analytics.interviewsScheduled / analytics.totalApplications) * 100)
        : 0;

    return (
        <DashboardLayout role="jobseeker">
            {/* Career Analytics Cards */}
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon blue">
                            <i className="bi bi-briefcase"></i>
                        </div>
                        <div className="stat-value">{analytics.totalApplications}</div>
                        <div className="stat-label">Total Applied</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon green">
                            <i className="bi bi-star"></i>
                        </div>
                        <div className="stat-value">{analytics.shortlistedCount}</div>
                        <div className="stat-label">Shortlisted Roles</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon teal">
                            <i className="bi bi-calendar-event"></i>
                        </div>
                        <div className="stat-value">{analytics.interviewsScheduled}</div>
                        <div className="stat-label">Interviews Scheduled</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon orange">
                            <i className="bi bi-graph-up-arrow"></i>
                        </div>
                        <div className="stat-value">{analytics.profileStrength}%</div>
                        <div className="stat-label">Profile Strength</div>
                    </div>
                </div>
            </div>

            {/* Career Analytics Progress & Conversion Funnel */}
            <div className="content-card mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="content-title mb-0">Career Analytics & Application Funnel</h5>
                    <span className="badge bg-teal-subtle text-teal border border-teal">
                        <i className="bi bi-lightning-charge-fill me-1"></i> {interviewRate}% Interview Conversion Rate
                    </span>
                </div>
                <div className="row g-4 align-items-center">
                    <div className="col-md-8">
                        <div className="mb-2 d-flex justify-content-between small">
                            <span className="fw-semibold">Application Stage Progression</span>
                            <span className="text-muted">{analytics.totalApplications} Submissions</span>
                        </div>
                        <div className="progress" style={{ height: '14px' }}>
                            <div className="progress-bar bg-primary" role="progressbar" style={{ width: '40%' }} title="Submitted / Under Review">
                                Applied
                            </div>
                            <div className="progress-bar bg-warning text-dark" role="progressbar" style={{ width: '35%' }} title="Shortlisted">
                                Shortlisted
                            </div>
                            <div className="progress-bar bg-success" role="progressbar" style={{ width: '25%' }} title="Interview Scheduled">
                                Interview
                            </div>
                        </div>
                        <div className="d-flex gap-3 mt-2 small text-muted">
                            <div><i className="bi bi-circle-fill text-primary me-1" style={{ fontSize: '0.6rem' }}></i> Under Review: {analytics.underReviewCount || 1}</div>
                            <div><i className="bi bi-circle-fill text-warning me-1" style={{ fontSize: '0.6rem' }}></i> Shortlisted: {analytics.shortlistedCount}</div>
                            <div><i className="bi bi-circle-fill text-success me-1" style={{ fontSize: '0.6rem' }}></i> Interview Ready: {analytics.interviewsScheduled}</div>
                        </div>
                    </div>
                    <div className="col-md-4 border-start ps-md-4">
                        <div className="small fw-bold text-muted text-uppercase mb-1">Resume & Profile Optimization</div>
                        <div className="small text-muted mb-2">
                            Your profile is in the top 15% of active applicants this week.
                        </div>
                        <Link to="/dashboard/jobseeker/cv" className="btn btn-sm btn-outline-primary">
                            <i className="bi bi-pencil-square me-1"></i> Optimize CV / Resume
                        </Link>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Recent Applications Tracking */}
                <div className="col-lg-8">
                    <div className="content-card h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="content-title mb-0">Track Job Application Status</h5>
                            <Link to="/dashboard/jobseeker/applied" className="btn btn-sm btn-outline-primary">
                                View Full History
                            </Link>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Target Position</th>
                                        <th>Company</th>
                                        <th>Applied Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myApplications.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center py-4 text-muted">
                                                No job applications yet. Browse jobs to apply!
                                            </td>
                                        </tr>
                                    ) : (
                                        myApplications.map(app => (
                                            <tr key={app.id}>
                                                <td>
                                                    <span className="fw-bold text-dark">{app.jobTitle}</span>
                                                </td>
                                                <td>{app.companyName}</td>
                                                <td className="small text-muted">{app.appliedDate || app.appliedAt}</td>
                                                <td>
                                                    <span
                                                        className={`badge rounded-pill ${
                                                            app.status === 'SHORTLISTED'
                                                                ? 'bg-success'
                                                                : app.status === 'INTERVIEW_SCHEDULED'
                                                                ? 'bg-info text-dark'
                                                                : app.status === 'REJECTED'
                                                                ? 'bg-danger'
                                                                : 'bg-warning text-dark'
                                                        }`}
                                                    >
                                                        {app.status === 'SUBMITTED' ? 'Applied' : app.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    {app.status === 'INTERVIEW_SCHEDULED' && app.interviewDetails ? (
                                                        <a
                                                            href={app.interviewDetails.link}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="btn btn-sm btn-teal text-white py-0 px-2"
                                                        >
                                                            <i className="bi bi-camera-video me-1"></i> Join
                                                        </a>
                                                    ) : (
                                                        <Link to="/dashboard/jobseeker/applied" className="btn btn-sm btn-link p-0 text-decoration-none">
                                                            Details
                                                        </Link>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Recommended Jobs */}
                <div className="col-lg-4">
                    <div className="content-card h-100">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="content-title mb-0">Matched for You</h5>
                            <Link to="/jobs" className="small text-primary text-decoration-none">Explore All</Link>
                        </div>
                        <div className="d-grid gap-3">
                            {recommendedJobs.map((job, i) => (
                                <div key={i} className="p-3 border rounded-3 bg-light-subtle hover-shadow">
                                    <div className="d-flex justify-content-between align-items-start mb-1">
                                        <h6 className="fw-bold mb-0 text-dark">{job.title}</h6>
                                        <span className="badge bg-light text-dark border small">{job.workMode}</span>
                                    </div>
                                    <div className="text-muted small mb-2">{job.companyName || 'Company'} • {job.location}</div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="fw-bold text-success small">
                                            ${job.salaryMin ? Number(job.salaryMin).toLocaleString() : '80,000'}
                                        </span>
                                        <Link to={`/jobs/${job.id}`} className="btn btn-sm btn-outline-primary py-0 px-2">
                                            View
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default JobSeekerDashboard;
