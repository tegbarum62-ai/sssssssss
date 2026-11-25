import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { apiRequest } from '../api';

const EmployerApplications = () => {
    const [applicants, setApplicants] = useState([]);
    const [filterJob, setFilterJob] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Review CV Modal State
    const [reviewingCandidate, setReviewingCandidate] = useState(null);
    const [customMessage, setCustomMessage] = useState('');

    // Schedule Interview Modal State
    const [interviewCandidate, setInterviewCandidate] = useState(null);
    const [interviewForm, setInterviewForm] = useState({
        date: '2026-12-05',
        time: '14:00 EST',
        mode: 'Google Meet',
        link: 'https://meet.google.com/et-job-interview',
        notes: 'Technical discussion and architecture walkthrough with the hiring team.'
    });

    const loadApplicants = () => {
        setLoading(true);
        apiRequest('/employer/applications')
            .then(data => {
                setApplicants(data || []);
                setError('');
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadApplicants();
    }, []);

    const updateStatus = async (id, status, message = '') => {
        setError('');
        setSuccessMsg('');
        try {
            await apiRequest(`/employer/applications/${id}/status`, {
                method: 'PUT',
                body: { status, customMessage: message }
            });
            setApplicants(applicants.map(a => a.id === id ? { ...a, status } : a));
            if (reviewingCandidate && reviewingCandidate.id === id) {
                setReviewingCandidate({ ...reviewingCandidate, status });
            }
            setSuccessMsg(`Candidate application marked as ${status}. Notification delivered.`);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleScheduleInterview = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        try {
            await apiRequest(`/employer/applications/${interviewCandidate.id}/schedule-interview`, {
                method: 'POST',
                body: interviewForm
            });
            setApplicants(applicants.map(a => a.id === interviewCandidate.id ? {
                ...a,
                status: 'INTERVIEW_SCHEDULED',
                interviewDetails: { ...interviewForm }
            } : a));
            setSuccessMsg(`Interview scheduled successfully with ${interviewCandidate.applicantName}! Invitation sent.`);
            setInterviewCandidate(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const jobTitles = ['All', ...new Set(applicants.map(a => a.jobTitle))];

    const filteredApplicants = applicants.filter(a => {
        const matchesJob = filterJob === 'All' || a.jobTitle === filterJob;
        const matchesStatus = filterStatus === 'All' || a.status === filterStatus;
        return matchesJob && matchesStatus;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'APPROVED':
                return <span className="badge bg-success-subtle text-success border border-success px-2 py-1"><i className="bi bi-check-circle-fill me-1"></i> Approved</span>;
            case 'SHORTLISTED':
                return <span className="badge bg-warning-subtle text-warning-emphasis border border-warning px-2 py-1"><i className="bi bi-star-fill me-1"></i> Shortlisted</span>;
            case 'INTERVIEW_SCHEDULED':
                return <span className="badge bg-info-subtle text-info-emphasis border border-info px-2 py-1"><i className="bi bi-calendar-event me-1"></i> Interview Scheduled</span>;
            case 'REJECTED':
                return <span className="badge bg-danger-subtle text-danger border border-danger px-2 py-1"><i className="bi bi-x-circle me-1"></i> Rejected</span>;
            case 'REVIEWED':
                return <span className="badge bg-secondary-subtle text-secondary px-2 py-1"><i className="bi bi-eye me-1"></i> Reviewed</span>;
            default:
                return <span className="badge bg-primary-subtle text-primary border border-primary px-2 py-1"><i className="bi bi-hourglass-split me-1"></i> Pending / Submitted</span>;
        }
    };

    return (
        <DashboardLayout role="employer">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div>
                    <h3 className="fw-bold mb-1">Job Seeker Application Management</h3>
                    <p className="text-muted small mb-0">View applicants, review CVs, shortlist candidates, arrange interviews, and approve or reject submissions.</p>
                </div>
                <div className="d-flex gap-2">
                    <select
                        className="form-select form-select-sm"
                        style={{ maxWidth: '200px' }}
                        value={filterJob}
                        onChange={e => setFilterJob(e.target.value)}
                    >
                        {jobTitles.map((title, i) => (
                            <option key={i} value={title}>{title === 'All' ? 'All Job Posts' : title}</option>
                        ))}
                    </select>
                    <select
                        className="form-select form-select-sm"
                        style={{ width: '180px' }}
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="SUBMITTED">Pending / Submitted</option>
                        <option value="SHORTLISTED">Shortlisted</option>
                        <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                        <option value="APPROVED">Approved / Accepted</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>
            </div>

            {error && <div className="alert alert-danger shadow-sm py-2 mb-3" role="alert">{error}</div>}
            {successMsg && <div className="alert alert-success shadow-sm py-2 mb-3" role="alert">{successMsg}</div>}

            <div className="content-card">
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Candidate</th>
                                <th>Target Position</th>
                                <th>Applied Date</th>
                                <th>Status</th>
                                <th>Review & Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">
                                        <div className="spinner-border spinner-border-sm text-primary" role="status" />
                                    </td>
                                </tr>
                            ) : filteredApplicants.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted">
                                        No applicant submissions matching your filter criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredApplicants.map(candidate => (
                                    <tr key={candidate.id}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div
                                                    className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold me-2"
                                                    style={{ width: '40px', height: '40px', minWidth: '40px' }}
                                                >
                                                    {candidate.applicantName ? candidate.applicantName.charAt(0) : 'C'}
                                                </div>
                                                <div>
                                                    <div className="fw-bold text-dark">{candidate.applicantName}</div>
                                                    <div className="text-muted small">{candidate.applicantEmail} • {candidate.applicantPhone}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="fw-semibold text-dark">{candidate.jobTitle}</span>
                                            <div className="small text-muted">{candidate.location || 'Remote'}</div>
                                        </td>
                                        <td className="small text-muted">{candidate.appliedDate || candidate.appliedAt}</td>
                                        <td>
                                            {getStatusBadge(candidate.status)}
                                            {candidate.interviewDetails && (
                                                <div className="small text-primary mt-1">
                                                    <i className="bi bi-calendar-event me-1"></i> {candidate.interviewDetails.date} @ {candidate.interviewDetails.time}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <div className="d-flex gap-1 flex-wrap align-items-center">
                                                {/* 1. Review CV */}
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    title="Review Candidate CV & Details"
                                                    onClick={() => setReviewingCandidate(candidate)}
                                                >
                                                    <i className="bi bi-file-earmark-person me-1"></i> Review CV
                                                </button>

                                                {/* 2. Shortlist */}
                                                {candidate.status !== 'SHORTLISTED' && candidate.status !== 'APPROVED' && (
                                                    <button
                                                        className="btn btn-sm btn-outline-warning"
                                                        title="Shortlist for Next Round"
                                                        onClick={() => updateStatus(candidate.id, 'SHORTLISTED')}
                                                    >
                                                        <i className="bi bi-star me-1"></i> Shortlist
                                                    </button>
                                                )}

                                                {/* 3. Schedule Interview */}
                                                <button
                                                    className="btn btn-sm btn-outline-info text-dark"
                                                    title="Schedule Interview"
                                                    onClick={() => setInterviewCandidate(candidate)}
                                                >
                                                    <i className="bi bi-calendar2-plus me-1"></i> Interview
                                                </button>

                                                {/* 4. Approve Application */}
                                                {candidate.status !== 'APPROVED' && (
                                                    <button
                                                        className="btn btn-sm btn-success"
                                                        title="Approve / Accept Applicant"
                                                        onClick={() => updateStatus(candidate.id, 'APPROVED')}
                                                    >
                                                        <i className="bi bi-check-lg me-1"></i> Approve
                                                    </button>
                                                )}

                                                {/* 5. Reject Application */}
                                                {candidate.status !== 'REJECTED' && (
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        title="Reject Application"
                                                        onClick={() => updateStatus(candidate.id, 'REJECTED')}
                                                    >
                                                        Reject
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* REVIEW APPLICANT CV & DETAILS MODAL */}
            {reviewingCandidate && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content shadow-lg border-0 rounded-4">
                            <div className="modal-header border-bottom">
                                <div className="d-flex align-items-center gap-3">
                                    <div
                                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-5"
                                        style={{ width: '48px', height: '48px' }}
                                    >
                                        {reviewingCandidate.applicantName.charAt(0)}
                                    </div>
                                    <div>
                                        <h5 className="modal-title fw-bold mb-0">{reviewingCandidate.applicantName}</h5>
                                        <small className="text-muted">Applied for: {reviewingCandidate.jobTitle} • {reviewingCandidate.appliedDate}</small>
                                    </div>
                                </div>
                                <button type="button" className="btn-close" onClick={() => setReviewingCandidate(null)}></button>
                            </div>
                            <div className="modal-body p-4">
                                {/* Current Status & Contact Header */}
                                <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded-3 mb-4">
                                    <div>
                                        <div className="small text-muted fw-bold">CONTACT INFORMATION</div>
                                        <div className="small text-dark mt-1">
                                            <i className="bi bi-envelope me-1"></i> {reviewingCandidate.applicantEmail} | <i className="bi bi-telephone me-1"></i> {reviewingCandidate.applicantPhone} | <i className="bi bi-geo-alt me-1"></i> {reviewingCandidate.location || 'United States'}
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <div className="small text-muted fw-bold mb-1">APPLICATION STATUS</div>
                                        {getStatusBadge(reviewingCandidate.status)}
                                    </div>
                                </div>

                                {/* Uploaded CV Document Card */}
                                <div className="card border-primary-subtle p-3 mb-4 bg-light-subtle rounded-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center gap-3">
                                            <i className="bi bi-file-earmark-pdf-fill text-danger fs-1"></i>
                                            <div>
                                                <div className="fw-bold text-dark">
                                                    {reviewingCandidate.cv?.uploadedFileName || `${reviewingCandidate.applicantName.replace(' ', '_')}_CV.pdf`}
                                                </div>
                                                <small className="text-muted">
                                                    {reviewingCandidate.cv?.uploadedFileSize || '245 KB'} • Verified Curriculum Vitae Document
                                                </small>
                                            </div>
                                        </div>
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => alert('Opening CV document in new tab')}>
                                            <i className="bi bi-download me-1"></i> Download / View CV
                                        </button>
                                    </div>
                                </div>

                                {/* Cover Letter / Note */}
                                <div className="mb-4">
                                    <h6 className="fw-bold text-uppercase text-secondary small border-bottom pb-1 mb-2">
                                        Applicant Cover Note
                                    </h6>
                                    <p className="text-dark small leading-relaxed bg-white p-3 border rounded">
                                        {reviewingCandidate.coverLetter || reviewingCandidate.notes || 'No custom cover letter provided.'}
                                    </p>
                                </div>

                                {/* CV Summary */}
                                <div className="mb-4">
                                    <h6 className="fw-bold text-uppercase text-secondary small border-bottom pb-1 mb-2">
                                        Professional Summary
                                    </h6>
                                    <p className="text-dark small leading-relaxed">
                                        {reviewingCandidate.cv?.summary || 'Experienced professional with proven track record in software engineering and collaborative product delivery.'}
                                    </p>
                                </div>

                                {/* Skills */}
                                <div className="mb-4">
                                    <h6 className="fw-bold text-uppercase text-secondary small border-bottom pb-1 mb-2">
                                        Technical Skills & Competencies
                                    </h6>
                                    <div className="d-flex flex-wrap gap-2 mt-2">
                                        {(reviewingCandidate.cv?.skills || ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker']).map((skill, i) => (
                                            <span key={i} className="badge bg-light text-dark border px-2 py-1">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Work Experience & Education */}
                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <h6 className="fw-bold text-uppercase text-secondary small border-bottom pb-1 mb-2">
                                            Work Experience
                                        </h6>
                                        <p className="small text-muted mb-0">
                                            {reviewingCandidate.cv?.experience || 'Senior Full Stack Engineer at CloudScale Technologies (2022-Present)'}
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <h6 className="fw-bold text-uppercase text-secondary small border-bottom pb-1 mb-2">
                                            Education
                                        </h6>
                                        <p className="small text-muted mb-0">
                                            {reviewingCandidate.cv?.education || 'B.S. in Computer Science - University of California, Berkeley (2019)'}
                                        </p>
                                    </div>
                                </div>

                                {/* Decision Actions Bar */}
                                <div className="border-top pt-3">
                                    <h6 className="fw-bold small mb-2">Update Application Status & Notify Candidate</h6>
                                    <div className="d-flex gap-2 flex-wrap">
                                        <button
                                            className="btn btn-success fw-bold px-3"
                                            onClick={() => updateStatus(reviewingCandidate.id, 'APPROVED')}
                                        >
                                            <i className="bi bi-check-circle-fill me-1"></i> Approve Application
                                        </button>
                                        <button
                                            className="btn btn-warning text-dark fw-bold px-3"
                                            onClick={() => updateStatus(reviewingCandidate.id, 'SHORTLISTED')}
                                        >
                                            <i className="bi bi-star-fill me-1"></i> Shortlist Candidate
                                        </button>
                                        <button
                                            className="btn btn-info text-dark fw-bold px-3"
                                            onClick={() => {
                                                const target = reviewingCandidate;
                                                setReviewingCandidate(null);
                                                setInterviewCandidate(target);
                                            }}
                                        >
                                            <i className="bi bi-calendar2-check-fill me-1"></i> Schedule Interview
                                        </button>
                                        <button
                                            className="btn btn-outline-danger px-3"
                                            onClick={() => updateStatus(reviewingCandidate.id, 'REJECTED')}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer border-top">
                                <button type="button" className="btn btn-secondary" onClick={() => setReviewingCandidate(null)}>
                                    Close Review
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SCHEDULE INTERVIEW MODAL */}
            {interviewCandidate && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content shadow-lg border-0 rounded-4">
                            <div className="modal-header border-bottom">
                                <h5 className="modal-title fw-bold">
                                    <i className="bi bi-calendar-check text-primary me-2"></i>
                                    Schedule Interview: {interviewCandidate.applicantName}
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setInterviewCandidate(null)}></button>
                            </div>
                            <form onSubmit={handleScheduleInterview}>
                                <div className="modal-body p-4">
                                    <p className="text-muted small mb-3">
                                        Configure interview details for <strong>{interviewCandidate.jobTitle}</strong>. The candidate will receive an immediate notification with this schedule.
                                    </p>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold">Interview Date</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={interviewForm.date}
                                                onChange={e => setInterviewForm({ ...interviewForm, date: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold">Interview Time</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="e.g. 10:30 AM EST"
                                                value={interviewForm.time}
                                                onChange={e => setInterviewForm({ ...interviewForm, time: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold">Interview Mode</label>
                                            <select
                                                className="form-select"
                                                value={interviewForm.mode}
                                                onChange={e => setInterviewForm({ ...interviewForm, mode: e.target.value })}
                                            >
                                                <option>Google Meet</option>
                                                <option>Zoom Video Call</option>
                                                <option>Microsoft Teams</option>
                                                <option>Phone Screening</option>
                                                <option>In-Person On-Site</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold">Meeting Link / Room</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={interviewForm.link}
                                                onChange={e => setInterviewForm({ ...interviewForm, link: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label small fw-bold">Instructions & Agenda for Candidate</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                value={interviewForm.notes}
                                                onChange={e => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-top">
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setInterviewCandidate(null)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-teal text-white fw-bold px-4">
                                        Send Interview Invite
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

export default EmployerApplications;
