import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api';
import { Link, useNavigate } from 'react-router-dom';

const EmployerPostJob = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [jobData, setJobData] = useState({
        title: '',
        category: 'Software Development',
        jobType: 'FULL_TIME',
        workMode: 'REMOTE',
        location: 'Seattle, WA',
        salaryMin: '100000',
        salaryMax: '140000',
        openings: '1',
        deadline: '2026-12-31',
        skills: '',
        description: ''
    });

    // Quick templates to help employer quickly post any role
    const templates = [
        { title: 'AI / LLM Solutions Architect', category: 'Artificial Intelligence', workMode: 'REMOTE', skills: 'Python, PyTorch, LangChain, RAG, Docker', min: 140000, max: 190000 },
        { title: 'Senior Cloud DevOps Engineer', category: 'DevOps', workMode: 'HYBRID', skills: 'Kubernetes, AWS, Terraform, CI/CD, Go', min: 120000, max: 160000 },
        { title: 'Full Stack React & Node Developer', category: 'Software Development', workMode: 'REMOTE', skills: 'React, TypeScript, Node.js, PostgreSQL, Tailwind', min: 110000, max: 150000 },
        { title: 'Principal Product Designer (UX/UI)', category: 'Design', workMode: 'REMOTE', skills: 'Figma, Design Systems, User Research, Prototyping', min: 105000, max: 145000 }
    ];

    const applyTemplate = (tpl) => {
        setJobData(prev => ({
            ...prev,
            title: tpl.title,
            category: tpl.category,
            workMode: tpl.workMode,
            skills: tpl.skills,
            salaryMin: String(tpl.min),
            salaryMax: String(tpl.max)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            await apiRequest('/jobs', {
                method: 'POST',
                body: {
                    title: jobData.title,
                    description: jobData.description,
                    skillsRequired: jobData.skills,
                    location: jobData.location,
                    category: jobData.category,
                    jobType: jobData.jobType,
                    workMode: jobData.workMode,
                    salaryMin: Number(jobData.salaryMin) || 60000,
                    salaryMax: Number(jobData.salaryMax) || 100000,
                    applicationDeadline: jobData.deadline,
                    openings: Number(jobData.openings) || 1
                }
            });

            setSuccess(`Success! "${jobData.title}" has been published and is now live across the job portal!`);
            // Reset form
            setJobData({
                title: '',
                category: 'Software Development',
                jobType: 'FULL_TIME',
                workMode: 'REMOTE',
                location: 'Remote',
                salaryMin: '',
                salaryMax: '',
                openings: '1',
                deadline: '',
                skills: '',
                description: ''
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <DashboardLayout role="employer">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div>
                    <h3 className="fw-bold mb-1">Post a New Job Opportunity</h3>
                    <p className="text-muted small mb-0">Publish custom vacancies to attract qualified candidates across all industries.</p>
                </div>
                <Link to="/dashboard/employer/jobs" className="btn btn-outline-secondary btn-sm">
                    <i className="bi bi-briefcase me-1"></i> View My Listed Jobs
                </Link>
            </div>

            {/* Quick Templates Banner */}
            <div className="card border-0 shadow-sm p-3 mb-4 rounded-3 bg-light">
                <span className="small fw-bold text-uppercase text-muted mb-2 d-block">
                    <i className="bi bi-lightning-charge-fill text-warning me-1"></i> Quick Role Presets (Click to autofill):
                </span>
                <div className="d-flex gap-2 flex-wrap">
                    {templates.map((tpl, i) => (
                        <button
                            key={i}
                            type="button"
                            className="btn btn-sm btn-white border shadow-xs"
                            onClick={() => applyTemplate(tpl)}
                        >
                            + {tpl.title}
                        </button>
                    ))}
                </div>
            </div>

            {error && <div className="alert alert-danger shadow-sm py-2 mb-4" role="alert">{error}</div>}
            {success && (
                <div className="alert alert-success shadow-sm py-3 mb-4 d-flex justify-content-between align-items-center" role="alert">
                    <div>
                        <i className="bi bi-check-circle-fill me-2 fs-5 text-success"></i>
                        <span>{success}</span>
                    </div>
                    <Link to="/jobs" className="btn btn-sm btn-success text-white">
                        Browse in Job Search <i className="bi bi-arrow-right ms-1"></i>
                    </Link>
                </div>
            )}

            <div className="content-card">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-8">
                            <label className="form-label fw-bold small">Job Title *</label>
                            <input
                                type="text"
                                className="form-control form-control-lg"
                                placeholder="e.g. Senior Distributed Systems Engineer"
                                value={jobData.title}
                                onChange={e => setJobData({ ...jobData, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-bold small">Industry / Category</label>
                            <select
                                className="form-select form-select-lg"
                                value={jobData.category}
                                onChange={e => setJobData({ ...jobData, category: e.target.value })}
                            >
                                <option>Software Development</option>
                                <option>Frontend Development</option>
                                <option>DevOps</option>
                                <option>Artificial Intelligence</option>
                                <option>Design</option>
                                <option>Product Management</option>
                                <option>Data Science</option>
                                <option>Marketing</option>
                                <option>Finance</option>
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label fw-bold small">Job Type</label>
                            <select
                                className="form-select"
                                value={jobData.jobType}
                                onChange={e => setJobData({ ...jobData, jobType: e.target.value })}
                            >
                                <option value="FULL_TIME">Full-time</option>
                                <option value="PART_TIME">Part-time</option>
                                <option value="CONTRACT">Contract</option>
                                <option value="INTERNSHIP">Internship</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-bold small">Work Mode</label>
                            <select
                                className="form-select"
                                value={jobData.workMode}
                                onChange={e => setJobData({ ...jobData, workMode: e.target.value })}
                            >
                                <option value="REMOTE">Remote</option>
                                <option value="HYBRID">Hybrid</option>
                                <option value="ON_SITE">On-Site</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-bold small">Location (City, State / Remote)</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. Seattle, WA or Worldwide"
                                value={jobData.location}
                                onChange={e => setJobData({ ...jobData, location: e.target.value })}
                                required
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label fw-bold small">Min Salary ($ / yr)</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="e.g. 90000"
                                value={jobData.salaryMin}
                                onChange={e => setJobData({ ...jobData, salaryMin: e.target.value })}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-bold small">Max Salary ($ / yr)</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="e.g. 135000"
                                value={jobData.salaryMax}
                                onChange={e => setJobData({ ...jobData, salaryMax: e.target.value })}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-bold small">Number of Openings</label>
                            <input
                                type="number"
                                className="form-control"
                                min="1"
                                value={jobData.openings}
                                onChange={e => setJobData({ ...jobData, openings: e.target.value })}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-bold small">Application Deadline</label>
                            <input
                                type="date"
                                className="form-control"
                                value={jobData.deadline}
                                onChange={e => setJobData({ ...jobData, deadline: e.target.value })}
                            />
                        </div>

                        <div className="col-12">
                            <label className="form-label fw-bold small">Key Skills Required (Comma separated)</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. React, Node.js, GraphQL, PostgreSQL, Microservices"
                                value={jobData.skills}
                                onChange={e => setJobData({ ...jobData, skills: e.target.value })}
                            />
                        </div>

                        <div className="col-12">
                            <label className="form-label fw-bold small">Detailed Job Description & Requirements *</label>
                            <textarea
                                className="form-control"
                                rows="6"
                                placeholder="Provide comprehensive details on responsibilities, team structure, qualifications, and benefits..."
                                value={jobData.description}
                                onChange={e => setJobData({ ...jobData, description: e.target.value })}
                                required
                            ></textarea>
                        </div>

                        <div className="col-12 mt-4 pt-2">
                            <button
                                type="submit"
                                className="btn btn-teal text-white px-5 py-3 fw-bold fs-6 shadow-sm"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" />
                                        Publishing Job...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-cloud-upload me-2"></i> Publish Job Post
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default EmployerPostJob;
