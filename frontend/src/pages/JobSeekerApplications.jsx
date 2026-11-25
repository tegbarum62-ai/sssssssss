import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { apiRequest } from '../api';
import { Link } from 'react-router-dom';

const JobSeekerApplications = () => {
    const [applications, setApplications] = useState([]);
    const [filter, setFilter] = useState('All');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const loadApplications = () => {
        setLoading(true);
        apiRequest('/applications/my-applications')
            .then(data => {
                setApplications(data || []);
                setError('');
            })
            .catch(requestError => setError(requestError.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadApplications();
    }, []);

    const filteredApplications = applications.filter(application => (
        filter === 'All' || application.status === filter
    ));

    const getStatusBadge = (status) => {
        switch (status) {
            case 'APPROVED':
                return <span className="badge bg-success text-white px-3 py-2 fs-7"><i className="bi bi-check-circle-fill me-1"></i> Approved / Accepted</span>;
            case 'SHORTLISTED':
                return <span className="badge bg-warning text-dark px-3 py-2 fs-7"><i className="bi bi-star-fill me-1"></i> Shortlisted</span>;
            case 'INTERVIEW_SCHEDULED':
                return <span className="badge bg-info text-dark px-3 py-2 fs-7"><i className="bi bi-calendar2-check-fill me-1"></i> Interview Scheduled</span>;
            case 'REJECTED':
                return <span className="badge bg-danger text-white px-3 py-2 fs-7"><i className="bi bi-x-circle-fill me-1"></i> Rejected</span>;
            default:
                return <span className="badge bg-primary text-white px-3 py-2 fs-7"><i className="bi bi-hourglass-split me-1"></i> Pending / Submitted</span>;
        }
    };

    return (
        <DashboardLayout role="jobseeker">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div>
                    <h3 className="fw-bold mb-1">Track Applications & History</h3>
                    <p className="text-muted small mb-0">Monitor live status changes across all job applications, from submission to approval.</p>
                </div>
                <div className="d-flex gap-2">
                    <select
                        className="form-select form-select-sm"
                        style={{ width: '220px' }}
                        value={filter}
                        onChange={event => setFilter(event.target.value)}
                    >
                        <option value="All">All Applications ({applications.length})</option>
                        <option value="SUBMITTED">Pending / Submitted</option>
                        <option value="SHORTLISTED">Shortlisted</option>
                        <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                        <option value="APPROVED">Approved / Accepted</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                    <Link to="/jobs" className="btn btn-sm btn-teal text-white">
                        <i className="bi bi-search me-1"></i> Search More Jobs
                    </Link>
                </div>
            </div>

            {error && <div className="alert alert-danger shadow-sm py-2 mb-3" role="alert">{error}</div>}

            <div className="content-card">
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Position & Role</th>
                                <th>Company</th>
                                <th>Applied Date</th>
                                <th>Status</th>
                                <th>Milestones & Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">
                                        <div className="spinner-border spinner-border-sm text-primary" role="status" />
                                    </td>
                                </tr>
                            ) : filteredApplications.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted">
                                        <i className="bi bi-inbox fs-2 d-block mb-2 text-secondary"></i>
                                        No applications found in this category.
                                        <div className="mt-2">
                                            <Link to="/jobs" className="btn btn-sm btn-outline-primary">
                                                Browse Available Positions
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredApplications.map(app => (
                                    <tr key={app.id}>
                                        <td>
                                            <div className="fw-bold text-dark">{app.jobTitle}</div>
                                            <small className="text-muted">Job Ref: #{app.jobId}</small>
                                        </td>
                                        <td>
                                            <span className="fw-semibold text-dark">{app.companyName}</span>
                                        </td>
                                        <td className="small text-muted">{app.appliedDate || app.appliedAt}</td>
                                        <td>
                                            {getStatusBadge(app.status)}
                                        </td>
                                        <td>
                                            {app.status === 'APPROVED' ? (
                                                <div className="p-2 border border-success rounded bg-success-subtle">
                                                    <div className="small fw-bold text-success">
                                                        <i className="bi bi-trophy-fill me-1"></i> Offer / Application Accepted!
                                                    </div>
                                                    <div className="small text-muted">The hiring team at {app.companyName} has approved your application.</div>
                                                </div>
                                            ) : app.status === 'INTERVIEW_SCHEDULED' && app.interviewDetails ? (
                                                <div className="p-2 border border-info rounded bg-light-subtle">
                                                    <div className="small fw-bold text-primary mb-1">
                                                        <i className="bi bi-calendar-event me-1"></i>
                                                        {app.interviewDetails.date} @ {app.interviewDetails.time} ({app.interviewDetails.mode})
                                                    </div>
                                                    <div className="small text-muted mb-2">
                                                        {app.interviewDetails.notes}
                                                    </div>
                                                    <a
                                                        href={app.interviewDetails.link}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="btn btn-sm btn-success px-3 py-1 text-white fw-bold"
                                                    >
                                                        <i className="bi bi-camera-video-fill me-1"></i> Join Meeting
                                                    </a>
                                                </div>
                                            ) : app.status === 'SHORTLISTED' ? (
                                                <div className="small text-warning-emphasis fw-bold">
                                                    <i className="bi bi-star-fill me-1"></i> Profile Shortlisted! Interview arrangement in progress.
                                                </div>
                                            ) : app.status === 'REJECTED' ? (
                                                <span className="text-muted small">Application archived</span>
                                            ) : (
                                                <span className="text-muted small">Application under hiring manager review</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default JobSeekerApplications;
