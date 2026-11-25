import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { apiRequest } from '../api';

const JobSeekerCV = () => {
    const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'builder'
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const [uploadedFile, setUploadedFile] = useState({
        name: 'John_Doe_Senior_Developer_Resume.pdf',
        size: '245 KB',
        uploadedAt: '2026-11-24'
    });

    const [cvData, setCvData] = useState({
        template: 'Modern Professional',
        sections: {
            personal: {
                name: 'John Doe',
                email: 'john.doe@email.com',
                phone: '+1 415-555-0133',
                location: 'San Francisco, CA',
                title: 'Senior Full Stack Engineer',
                website: 'https://johndoe.dev'
            },
            summary: 'Experienced Software Engineer with over 5 years developing scalable cloud services, web applications, and intuitive user interfaces. Adept in modern JavaScript/TypeScript ecosystems, React, Node.js, and containerized deployment.',
            experience: [
                {
                    role: 'Senior Software Engineer',
                    company: 'CloudScale Technologies',
                    duration: '2022 - Present',
                    description: 'Architected distributed web portals handling 10M+ monthly requests. Reduced API latency by 35% through Redis caching and query optimization.'
                },
                {
                    role: 'Full Stack Developer',
                    company: 'WebSphere Innovations',
                    duration: '2019 - 2022',
                    description: 'Developed interactive customer-facing web apps with React, Bootstrap, and Node.js REST APIs.'
                }
            ],
            education: [
                {
                    degree: 'B.S. in Computer Science',
                    school: 'University of California, Berkeley',
                    year: '2019'
                }
            ],
            skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'RESTful APIs', 'Git', 'Bootstrap 5', 'Jest'],
            certifications: ['AWS Certified Solutions Architect - Associate', 'Meta Certified Front-End Developer']
        }
    });

    useEffect(() => {
        setLoading(true);
        apiRequest('/jobseeker/cv')
            .then(data => {
                if (data) {
                    if (data.uploadedFile) setUploadedFile(data.uploadedFile);
                    if (data.sections) setCvData(data);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setError('');
        setSuccessMsg('');

        try {
            const sizeStr = file.size > 1024 * 1024
                ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                : `${Math.round(file.size / 1024)} KB`;

            const res = await apiRequest('/jobseeker/cv/upload', {
                method: 'POST',
                body: {
                    fileName: file.name,
                    fileSize: sizeStr
                }
            });

            setUploadedFile(res.uploadedFile || {
                name: file.name,
                size: sizeStr,
                uploadedAt: new Date().toISOString().split('T')[0]
            });
            setSuccessMsg(`"${file.name}" uploaded successfully and linked to your job applications!`);
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSaveCV = async () => {
        setError('');
        setSuccessMsg('');
        try {
            await apiRequest('/jobseeker/cv', {
                method: 'POST',
                body: cvData
            });
            setIsEditing(false);
            setSuccessMsg('Your CV has been saved and updated successfully!');
        } catch (err) {
            setError(err.message);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <DashboardLayout role="jobseeker">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div>
                    <h3 className="fw-bold mb-1">Curriculum Vitae (CV) Management</h3>
                    <p className="text-muted small mb-0">Upload your PDF/DOCX resume or design a tailored interactive CV.</p>
                </div>
                <div className="btn-group">
                    <button
                        className={`btn ${activeTab === 'upload' ? 'btn-teal text-white fw-bold' : 'btn-outline-secondary'}`}
                        onClick={() => setActiveTab('upload')}
                    >
                        <i className="bi bi-cloud-arrow-up me-1"></i> Upload CV Document
                    </button>
                    <button
                        className={`btn ${activeTab === 'builder' ? 'btn-teal text-white fw-bold' : 'btn-outline-secondary'}`}
                        onClick={() => setActiveTab('builder')}
                    >
                        <i className="bi bi-file-earmark-person me-1"></i> Interactive CV Builder
                    </button>
                </div>
            </div>

            {error && <div className="alert alert-danger shadow-sm py-2 mb-3" role="alert">{error}</div>}
            {successMsg && <div className="alert alert-success shadow-sm py-2 mb-3" role="alert">{successMsg}</div>}

            {/* TAB 1: UPLOAD CV */}
            {activeTab === 'upload' && (
                <div className="row g-4">
                    <div className="col-lg-7">
                        <div className="content-card">
                            <h5 className="content-title mb-3">Upload Your Resume Document</h5>
                            <p className="text-muted small mb-4">
                                Supported file types: <strong>PDF, DOC, DOCX</strong> (Max file size: 10MB). When you apply for jobs, employers will review this document.
                            </p>

                            {/* Dropzone Box */}
                            <div className="border border-2 border-dashed rounded-4 p-5 text-center bg-light mb-4 position-relative">
                                <i className="bi bi-cloud-arrow-up-fill text-primary display-4 mb-3 d-block"></i>
                                <h6 className="fw-bold mb-1">Choose a CV file or drag & drop here</h6>
                                <p className="text-muted small mb-3">PDF is recommended for optimal formatting across all devices</p>

                                <label className="btn btn-teal text-white fw-bold px-4 py-2 cursor-pointer shadow-sm">
                                    <i className="bi bi-folder2-open me-2"></i> Browse Computer
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        className="d-none"
                                        onChange={handleFileUpload}
                                        disabled={uploading}
                                    />
                                </label>

                                {uploading && (
                                    <div className="mt-3">
                                        <div className="spinner-border spinner-border-sm text-primary me-2" role="status" />
                                        <span className="small text-muted">Uploading and indexing document...</span>
                                    </div>
                                )}
                            </div>

                            {/* Current Uploaded CV File Card */}
                            {uploadedFile && (
                                <div className="card border-0 bg-primary-subtle p-4 rounded-4 shadow-xs">
                                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="bg-white rounded-3 p-3 text-danger shadow-xs">
                                                <i className="bi bi-file-earmark-pdf-fill fs-2"></i>
                                            </div>
                                            <div>
                                                <h6 className="fw-bold text-dark mb-1">{uploadedFile.name}</h6>
                                                <div className="small text-muted">
                                                    <span>Size: {uploadedFile.size}</span> • <span>Uploaded: {uploadedFile.uploadedAt}</span>
                                                </div>
                                                <span className="badge bg-success-subtle text-success border border-success mt-2">
                                                    <i className="bi bi-check-circle-fill me-1"></i> Active for Applications
                                                </span>
                                            </div>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-sm btn-white border shadow-xs"
                                                onClick={() => alert(`Opening ${uploadedFile.name}`)}
                                            >
                                                <i className="bi bi-eye me-1"></i> View
                                            </button>
                                            <label className="btn btn-sm btn-primary cursor-pointer mb-0">
                                                <i className="bi bi-arrow-repeat me-1"></i> Replace
                                                <input
                                                    type="file"
                                                    accept=".pdf,.doc,.docx"
                                                    className="d-none"
                                                    onChange={handleFileUpload}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-lg-5">
                        <div className="content-card border-0 bg-white p-4 h-100">
                            <h6 className="fw-bold text-uppercase text-secondary small mb-3">
                                <i className="bi bi-shield-check text-primary me-1"></i> CV Upload Tips
                            </h6>
                            <ul className="list-unstyled small text-muted d-grid gap-3 mb-0">
                                <li className="d-flex gap-2">
                                    <i className="bi bi-check-circle-fill text-success fs-6 mt-1"></i>
                                    <span><strong>Keep it concise:</strong> 1-2 pages highlighting your top achievements and tangible metrics.</span>
                                </li>
                                <li className="d-flex gap-2">
                                    <i className="bi bi-check-circle-fill text-success fs-6 mt-1"></i>
                                    <span><strong>Include keywords:</strong> Match your technical tools and proficiencies with the job descriptions you apply to.</span>
                                </li>
                                <li className="d-flex gap-2">
                                    <i className="bi bi-check-circle-fill text-success fs-6 mt-1"></i>
                                    <span><strong>Accurate contact details:</strong> Ensure your email and phone number are correct for employer interview invites.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: INTERACTIVE BUILDER */}
            {activeTab === 'builder' && (
                <div className="row g-4">
                    <div className="col-12 d-flex justify-content-end gap-2 mb-2">
                        <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            <i className={`bi ${isEditing ? 'bi-check2' : 'bi-pencil'} me-1`}></i>
                            {isEditing ? 'Finish Editing' : 'Edit Sections'}
                        </button>
                        <button className="btn btn-sm btn-teal text-white fw-bold" onClick={handlePrint}>
                            <i className="bi bi-printer me-1"></i> Print / Save PDF
                        </button>
                    </div>

                    {/* CV Editor Form (Shown if editing) */}
                    {isEditing && (
                        <div className="col-lg-5">
                            <div className="content-card">
                                <h5 className="content-title mb-3">Edit Resume Sections</h5>
                                <form onSubmit={e => { e.preventDefault(); handleSaveCV(); }}>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Template Style</label>
                                        <select
                                            className="form-select"
                                            value={cvData.template}
                                            onChange={e => setCvData({ ...cvData, template: e.target.value })}
                                        >
                                            <option>Modern Professional</option>
                                            <option>Minimalist Tech</option>
                                            <option>Executive</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Full Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={cvData.sections.personal.name}
                                            onChange={e => setCvData({
                                                ...cvData,
                                                sections: {
                                                    ...cvData.sections,
                                                    personal: { ...cvData.sections.personal, name: e.target.value }
                                                }
                                            })}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Professional Headline</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={cvData.sections.personal.title}
                                            onChange={e => setCvData({
                                                ...cvData,
                                                sections: {
                                                    ...cvData.sections,
                                                    personal: { ...cvData.sections.personal, title: e.target.value }
                                                }
                                            })}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Professional Summary</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            value={cvData.sections.summary}
                                            onChange={e => setCvData({
                                                ...cvData,
                                                sections: { ...cvData.sections, summary: e.target.value }
                                            })}
                                        ></textarea>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Skills (comma separated)</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={cvData.sections.skills.join(', ')}
                                            onChange={e => setCvData({
                                                ...cvData,
                                                sections: {
                                                    ...cvData.sections,
                                                    skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                                                }
                                            })}
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-teal text-white w-100 py-2 fw-bold">
                                        Save CV Changes
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* CV Live Document Preview */}
                    <div className={isEditing ? 'col-lg-7' : 'col-12'}>
                        <div className="content-card p-5 bg-white shadow border rounded-4" id="cv-print-area">
                            <div className="border-bottom pb-4 mb-4 text-center">
                                <h2 className="fw-bold text-dark mb-1">{cvData.sections.personal.name}</h2>
                                <h5 className="text-primary fw-semibold mb-2">{cvData.sections.personal.title}</h5>
                                <div className="small text-muted d-flex justify-content-center gap-3 flex-wrap">
                                    <span><i className="bi bi-envelope me-1"></i> {cvData.sections.personal.email}</span>
                                    <span><i className="bi bi-telephone me-1"></i> {cvData.sections.personal.phone}</span>
                                    <span><i className="bi bi-geo-alt me-1"></i> {cvData.sections.personal.location}</span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h6 className="fw-bold text-uppercase text-secondary border-bottom pb-1 mb-2">
                                    Professional Summary
                                </h6>
                                <p className="text-dark small leading-relaxed">{cvData.sections.summary}</p>
                            </div>

                            <div className="mb-4">
                                <h6 className="fw-bold text-uppercase text-secondary border-bottom pb-1 mb-3">
                                    Work Experience
                                </h6>
                                {cvData.sections.experience.map((exp, i) => (
                                    <div key={i} className="mb-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="fw-bold text-dark">{exp.role}</span>
                                            <span className="text-muted small">{exp.duration}</span>
                                        </div>
                                        <div className="text-primary small fw-semibold mb-1">{exp.company}</div>
                                        <p className="small text-muted mb-0">{exp.description}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mb-4">
                                <h6 className="fw-bold text-uppercase text-secondary border-bottom pb-1 mb-3">
                                    Education
                                </h6>
                                {cvData.sections.education.map((edu, i) => (
                                    <div key={i} className="mb-2 d-flex justify-content-between">
                                        <div>
                                            <div className="fw-bold text-dark small">{edu.degree}</div>
                                            <div className="text-muted small">{edu.school}</div>
                                        </div>
                                        <div className="text-muted small">{edu.year}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="mb-4">
                                <h6 className="fw-bold text-uppercase text-secondary border-bottom pb-1 mb-2">
                                    Technical Skills & Competencies
                                </h6>
                                <div className="d-flex flex-wrap gap-2 mt-2">
                                    {cvData.sections.skills.map((skill, i) => (
                                        <span key={i} className="badge bg-light text-dark border px-2 py-1">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default JobSeekerCV;
