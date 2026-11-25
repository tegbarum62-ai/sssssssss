import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { apiRequest } from '../api';

const AdminActivity = () => {
    const [activeTab, setActiveTab] = useState('jobs');
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(true);

    const loadData = () => {
        setLoading(true);
        Promise.all([
            apiRequest('/admin/jobs'),
            apiRequest('/admin/applications'),
            apiRequest('/admin/audit-logs')
        ])
            .then(([jobResults, appResults, logResults]) => {
                setJobs(jobResults || []);
                setApplications(appResults || []);
                setAuditLogs(logResults || []);
                setError('');
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleJobStatus = async (id, newStatus) => {
        setError('');
        setSuccessMsg('');
        try {
            await apiRequest(`/jobs/${id}`, {
                method: 'PUT',
                body: { status: newStatus }
            });
            setJobs(jobs.map(j => j.id === id ? { ...j, status: newStatus } : j));
            setSuccessMsg(`Job post #${id} status changed to ${newStatus}.`);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteJob = async (id, title) => {
        if (!window.confirm(`Are you sure you want to delete job post "${title}"?`)) return;
        setError('');
        setSuccessMsg('');
        try {
            await apiRequest(`/admin/jobs/${id}`, { method: 'DELETE' });
            setJobs(jobs.filter(j => j.id !== id));
            setSuccessMsg(`Job #${id} deleted successfully.`);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <DashboardLayout role="admin">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div>
                    <h3 className="fw-bold mb-1">System Activity & Moderation</h3>
                    <p className="text-muted small mb-0">Oversee all jobs, monitor candidate submissions, and inspect security audit trails.</p>
                </div>
                <div className="btn-group">
                    <button
                        className={`btn ${activeTab === 'jobs' ? 'btn-teal text-white fw-bold' : 'btn-outline-secondary'}`}
                        onClick={() => setActiveTab('jobs')}
                    >
                        <i className="bi bi-briefcase me-2"></i> All Jobs ({jobs.length})
                    </button>
                    <button
                        className={`btn ${activeTab === 'applications' ? 'btn-teal text-white fw-bold' : 'btn-outline-secondary'}`}
                        onClick={() => setActiveTab('applications')}
                    >
                        <i className="bi bi-file-earmark-person me-2"></i> Applications ({applications.length})
                    </button>
                    <button
                        className={`btn ${activeTab === 'audit' ? 'btn-teal text-white fw-bold' : 'btn-outline-secondary'}`}
                        onClick={() => setActiveTab('audit')}
                    >
                        <i className="bi bi-shield-check me-2"></i> Audit Logs ({auditLogs.length})
                    </button>
                </div>
            </div>

            {error && <div className="alert alert-danger shadow-sm py-2 mb-3" role="alert">{error}</div>}
            {successMsg && <div className="alert alert-success shadow-sm py-2 mb-3" role="alert">{successMsg}</div>}

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status" />
                </div>
            ) : (
                <>
                    {/* TAB 1: ALL JOBS */}
                    {activeTab === 'jobs' && (
                        <div className="content-card">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="content-title mb-0">Manage All Job Postings</h5>
                                <span className="badge bg-primary rounded-pill px-3 py-2">{jobs.length} total posts</span>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Job Role</th>
                                            <th>Employer</th>
                                            <th>Category</th>
                                            <th>Applicants</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {jobs.map(job => (
                                            <tr key={job.id}>
                                                <td>
                                                    <div className="fw-bold text-dark">{job.title}</div>
                                                    <small className="text-muted">{job.location} • {job.jobType}</small>
                                                </td>
                                                <td>{job.companyName || 'Company'}</td>
                                                <td><span className="badge bg-light text-dark border">{job.category}</span></td>
                                                <td>
                                                    <span className="badge bg-primary-subtle text-primary border border-primary px-2 py-1">
                                                        <i className="bi bi-people me-1"></i> {job.applicationCount || 0}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span
                                                        className={`badge rounded-pill ${
                                                            job.status === 'ACTIVE'
                                                                ? 'bg-success'
                                                                : job.status === 'PENDING'
                                                                ? 'bg-warning text-dark'
                                                                : job.status === 'CLOSED'
                                                                ? 'bg-secondary'
                                                                : 'bg-danger'
                                                        }`}
                                                    >
                                                        {job.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        {job.status !== 'ACTIVE' ? (
                                                            <button
                                                                className="btn btn-sm btn-outline-success"
                                                                onClick={() => handleJobStatus(job.id, 'ACTIVE')}
                                                            >
                                                                Activate
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="btn btn-sm btn-outline-warning"
                                                                onClick={() => handleJobStatus(job.id, 'CLOSED')}
                                                            >
                                                                Close
                                                            </button>
                                                        )}
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => handleDeleteJob(job.id, job.title)}
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: APPLICATIONS ACTIVITY */}
                    {activeTab === 'applications' && (
                        <div className="content-card">
                            <h5 className="content-title mb-3">Live Applications Stream</h5>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Applicant</th>
                                            <th>Target Job</th>
                                            <th>Employer</th>
                                            <th>Date Submitted</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applications.map(app => (
                                            <tr key={app.id}>
                                                <td>
                                                    <div className="fw-bold">{app.applicantName}</div>
                                                    <div className="text-muted small">{app.applicantEmail}</div>
                                                </td>
                                                <td>
                                                    <div className="fw-semibold text-dark">{app.jobTitle}</div>
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
                                                                : 'bg-primary'
                                                        }`}
                                                    >
                                                        {app.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: AUDIT LOGS */}
                    {activeTab === 'audit' && (
                        <div className="content-card">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="content-title mb-0">System Security & Audit Trail</h5>
                                <button className="btn btn-sm btn-outline-secondary" onClick={loadData}>
                                    <i className="bi bi-arrow-clockwise me-1"></i> Refresh
                                </button>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-sm table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Timestamp</th>
                                            <th>Actor</th>
                                            <th>Action</th>
                                            <th>Details</th>
                                            <th>Origin IP</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {auditLogs.map(log => (
                                            <tr key={log.id}>
                                                <td className="small text-nowrap text-muted">{log.timestamp}</td>
                                                <td className="small fw-semibold">{log.actor}</td>
                                                <td>
                                                    <span className="badge bg-dark-subtle text-dark border">
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="small text-break">{log.details}</td>
                                                <td className="small text-muted text-nowrap">{log.ip}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
        </DashboardLayout>
    );
};

export default AdminActivity;
