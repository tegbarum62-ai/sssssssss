import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { apiRequest } from '../api';

const AdminApprovals = () => {
    const [activeTab, setActiveTab] = useState('employers');
    const [employers, setEmployers] = useState([]);
    const [pendingJobs, setPendingJobs] = useState([]);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(true);

    const loadData = () => {
        setLoading(true);
        Promise.all([
            apiRequest('/admin/employers/pending'),
            apiRequest('/admin/jobs/pending')
        ])
            .then(([empData, jobData]) => {
                setEmployers(empData || []);
                setPendingJobs(jobData || []);
                setError('');
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleEmployerAction = async (id, status) => {
        setError('');
        setSuccessMsg('');
        try {
            await apiRequest(`/admin/users/${id}/${status.toLowerCase()}`, { method: 'POST' });
            setEmployers(current => current.filter(e => e.id !== id));
            setSuccessMsg(`Employer verification application has been ${status.toLowerCase()}ed.`);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleJobAction = async (id, action) => {
        setError('');
        setSuccessMsg('');
        try {
            await apiRequest(`/admin/jobs/${id}/${action}`, { method: 'POST' });
            setPendingJobs(current => current.filter(j => j.id !== id));
            setSuccessMsg(`Job post #${id} has been ${action}d successfully.`);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <DashboardLayout role="admin">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div>
                    <h3 className="fw-bold mb-1">Approval Queues</h3>
                    <p className="text-muted small mb-0">Verify employer business registration and moderate new job listings.</p>
                </div>
                <div className="btn-group">
                    <button
                        className={`btn ${activeTab === 'employers' ? 'btn-teal text-white fw-bold' : 'btn-outline-secondary'}`}
                        onClick={() => setActiveTab('employers')}
                    >
                        <i className="bi bi-building-check me-2"></i>
                        Employer Verifications ({employers.length})
                    </button>
                    <button
                        className={`btn ${activeTab === 'jobs' ? 'btn-teal text-white fw-bold' : 'btn-outline-secondary'}`}
                        onClick={() => setActiveTab('jobs')}
                    >
                        <i className="bi bi-briefcase me-2"></i>
                        Job Approvals Queue ({pendingJobs.length})
                    </button>
                </div>
            </div>

            {error && <div className="alert alert-danger shadow-sm py-2 mb-4" role="alert">{error}</div>}
            {successMsg && <div className="alert alert-success shadow-sm py-2 mb-4" role="alert">{successMsg}</div>}

            {activeTab === 'employers' && (
                <div>
                    <div className="alert alert-warning border-0 shadow-sm mb-4">
                        <div className="d-flex align-items-center">
                            <i className="bi bi-shield-lock-fill fs-3 me-3 text-warning"></i>
                            <div>
                                <h6 className="mb-1 fw-bold">Employer Business Verification Required</h6>
                                <p className="mb-0 small opacity-75">
                                    Employers can only publish live job posts after administrator review of their official tax and trade registration credentials.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="content-card">
                        <h5 className="content-title">Pending Employer Applications ({employers.length})</h5>
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status" />
                            </div>
                        ) : employers.length === 0 ? (
                            <div className="text-center py-5 text-muted">
                                <i className="bi bi-check-circle-fill text-success fs-1 mb-2 d-block"></i>
                                All employer business verification requests have been processed!
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Company / Org</th>
                                            <th>Contact Info</th>
                                            <th>Registration & Tax IDs</th>
                                            <th>Uploaded Documents</th>
                                            <th>Submitted</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employers.map(emp => (
                                            <tr key={emp.id}>
                                                <td>
                                                    <div className="fw-bold text-dark">{emp.companyName}</div>
                                                    <small className="text-muted d-block text-truncate" style={{ maxWidth: '220px' }}>
                                                        {emp.companyDescription}
                                                    </small>
                                                </td>
                                                <td>
                                                    <div className="small fw-semibold">{emp.email}</div>
                                                    <div className="small text-muted">{emp.phone}</div>
                                                </td>
                                                <td>
                                                    <div className="badge bg-light text-dark border me-1">
                                                        BRN: {emp.businessRegistrationNumber}
                                                    </div>
                                                    <div className="badge bg-light text-dark border mt-1">
                                                        TIN: {emp.tinNumber}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex flex-column gap-1">
                                                        <span className="badge bg-info-subtle text-info border">
                                                            <i className="bi bi-file-earmark-pdf me-1"></i> {emp.taxClearanceCertificate}
                                                        </span>
                                                        <span className="badge bg-info-subtle text-info border">
                                                            <i className="bi bi-file-earmark-check me-1"></i> {emp.businessLicenseDocument}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="small text-muted">{emp.registeredAt}</td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <button
                                                            className="btn btn-sm btn-success px-3"
                                                            onClick={() => handleEmployerAction(emp.id, 'Approve')}
                                                        >
                                                            <i className="bi bi-check-lg me-1"></i> Approve
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => handleEmployerAction(emp.id, 'Reject')}
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'jobs' && (
                <div>
                    <div className="content-card">
                        <h5 className="content-title">Job Posts Waiting for Review ({pendingJobs.length})</h5>
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status" />
                            </div>
                        ) : pendingJobs.length === 0 ? (
                            <div className="text-center py-5 text-muted">
                                <i className="bi bi-check-circle-fill text-success fs-1 mb-2 d-block"></i>
                                There are no pending job posts in the approval queue!
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Job Title</th>
                                            <th>Company</th>
                                            <th>Category & Mode</th>
                                            <th>Salary</th>
                                            <th>Requirements</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingJobs.map(job => (
                                            <tr key={job.id}>
                                                <td>
                                                    <div className="fw-bold text-dark">{job.title}</div>
                                                    <div className="text-muted small text-truncate" style={{ maxWidth: '250px' }}>
                                                        {job.description}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="fw-semibold">{job.companyName || 'Company'}</span>
                                                    <div className="small text-muted">{job.location}</div>
                                                </td>
                                                <td>
                                                    <span className="badge bg-secondary-subtle text-secondary me-1">{job.category}</span>
                                                    <span className="badge bg-light text-dark border">{job.workMode}</span>
                                                </td>
                                                <td className="small fw-bold text-success">
                                                    ${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()}
                                                </td>
                                                <td>
                                                    <small className="text-muted">{job.skillsRequired || 'Standard'}</small>
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <button
                                                            className="btn btn-sm btn-success px-3"
                                                            onClick={() => handleJobAction(job.id, 'approve')}
                                                        >
                                                            <i className="bi bi-check-circle me-1"></i> Approve
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => handleJobAction(job.id, 'reject')}
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default AdminApprovals;
