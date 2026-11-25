import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { apiRequest } from '../api';
import { Link } from 'react-router-dom';

const EmployerManageJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Editing State
    const [editingJob, setEditingJob] = useState(null);

    const loadJobs = () => {
        setLoading(true);
        apiRequest('/employer/jobs')
            .then(data => {
                setJobs(data || []);
                setError('');
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadJobs();
    }, []);

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
        setError('');
        setSuccessMsg('');
        try {
            await apiRequest(`/jobs/${id}`, {
                method: 'PUT',
                body: { status: newStatus }
            });
            setJobs(jobs.map(j => j.id === id ? { ...j, status: newStatus } : j));
            setSuccessMsg(`Job post #${id} is now ${newStatus.toLowerCase()}.`);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Are you sure you want to delete job post "${title}"?`)) return;
        setError('');
        setSuccessMsg('');
        try {
            await apiRequest(`/employer/jobs/${id}`, { method: 'DELETE' });
            setJobs(jobs.filter(j => j.id !== id));
            setSuccessMsg(`Job post "${title}" has been deleted.`);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        try {
            await apiRequest(`/jobs/${editingJob.id}`, {
                method: 'PUT',
                body: {
                    title: editingJob.title,
                    location: editingJob.location,
                    category: editingJob.category,
                    salaryMin: Number(editingJob.salaryMin),
                    salaryMax: Number(editingJob.salaryMax),
                    description: editingJob.description,
                    skillsRequired: editingJob.skillsRequired
                }
            });
            setJobs(jobs.map(j => j.id === editingJob.id ? { ...j, ...editingJob } : j));
            setSuccessMsg(`Job #${editingJob.id} updated successfully!`);
            setEditingJob(null);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <DashboardLayout role="employer">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div>
                    <h3 className="fw-bold mb-1">Manage Your Job Postings</h3>
                    <p className="text-muted small mb-0">Track performance, edit details, or close positions.</p>
                </div>
                <Link to="/dashboard/employer/post-job" className="btn btn-teal text-white fw-bold">
                    <i className="bi bi-plus-circle me-1"></i> Post Another Job
                </Link>
            </div>

            {error && <div className="alert alert-danger shadow-sm py-2 mb-3" role="alert">{error}</div>}
            {successMsg && <div className="alert alert-success shadow-sm py-2 mb-3" role="alert">{successMsg}</div>}

            <div className="content-card">
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Job Title</th>
                                <th>Category & Mode</th>
                                <th>Salary Range</th>
                                <th>Applicants</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">
                                        <div className="spinner-border spinner-border-sm text-primary" role="status" />
                                    </td>
                                </tr>
                            ) : jobs.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-5 text-muted">
                                        <i className="bi bi-briefcase fs-2 d-block mb-2 text-secondary"></i>
                                        You have not posted any jobs yet.
                                        <div className="mt-2">
                                            <Link to="/dashboard/employer/post-job" className="btn btn-sm btn-teal text-white">
                                                Create Your First Job Post
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                jobs.map(job => (
                                    <tr key={job.id}>
                                        <td>
                                            <div className="fw-bold text-dark">{job.title}</div>
                                            <small className="text-muted">{job.location} • {job.jobType}</small>
                                        </td>
                                        <td>
                                            <span className="badge bg-light text-dark border me-1">{job.category}</span>
                                            <span className="badge bg-secondary-subtle text-secondary">{job.workMode || 'REMOTE'}</span>
                                        </td>
                                        <td className="small fw-semibold text-dark">
                                            ${job.salaryMin ? Number(job.salaryMin).toLocaleString() : '60,000'} - ${job.salaryMax ? Number(job.salaryMax).toLocaleString() : '100,000'}
                                        </td>
                                        <td>
                                            <Link to="/dashboard/employer/applications" className="badge bg-primary-subtle text-primary border border-primary text-decoration-none px-2 py-1">
                                                <i className="bi bi-people-fill me-1"></i> {job.applicationCount || 0} applicants
                                            </Link>
                                        </td>
                                        <td>
                                            <span className={`badge rounded-pill ${job.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`}>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => setEditingJob({ ...job })}
                                                >
                                                    <i className="bi bi-pencil me-1"></i> Edit
                                                </button>
                                                <button
                                                    className={`btn btn-sm ${job.status === 'ACTIVE' ? 'btn-outline-warning' : 'btn-outline-success'}`}
                                                    onClick={() => handleToggleStatus(job.id, job.status)}
                                                >
                                                    {job.status === 'ACTIVE' ? 'Close' : 'Reopen'}
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDelete(job.id, job.title)}
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* EDIT JOB MODAL */}
            {editingJob && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content shadow-lg border-0 rounded-4">
                            <div className="modal-header border-bottom">
                                <h5 className="modal-title fw-bold">Edit Job Post: {editingJob.title}</h5>
                                <button type="button" className="btn-close" onClick={() => setEditingJob(null)}></button>
                            </div>
                            <form onSubmit={handleSaveEdit}>
                                <div className="modal-body p-4">
                                    <div className="row g-3">
                                        <div className="col-md-8">
                                            <label className="form-label small fw-bold">Job Title</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editingJob.title}
                                                onChange={e => setEditingJob({ ...editingJob, title: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label small fw-bold">Category</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editingJob.category}
                                                onChange={e => setEditingJob({ ...editingJob, category: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold">Location</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editingJob.location}
                                                onChange={e => setEditingJob({ ...editingJob, location: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label small fw-bold">Min Salary ($)</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={editingJob.salaryMin}
                                                onChange={e => setEditingJob({ ...editingJob, salaryMin: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label small fw-bold">Max Salary ($)</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={editingJob.salaryMax}
                                                onChange={e => setEditingJob({ ...editingJob, salaryMax: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label small fw-bold">Skills Required</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editingJob.skillsRequired || ''}
                                                onChange={e => setEditingJob({ ...editingJob, skillsRequired: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label small fw-bold">Job Description</label>
                                            <textarea
                                                className="form-control"
                                                rows="5"
                                                value={editingJob.description}
                                                onChange={e => setEditingJob({ ...editingJob, description: e.target.value })}
                                                required
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-top">
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setEditingJob(null)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-teal text-white fw-bold px-4">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default EmployerManageJobs;
