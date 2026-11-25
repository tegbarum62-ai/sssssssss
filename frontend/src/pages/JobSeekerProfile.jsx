import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api';

const JobSeekerProfile = () => {
    const { user, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const [profile, setProfile] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: user?.email || 'john.doe@email.com',
        phone: '+1 415-555-0133',
        location: 'San Francisco, CA',
        headline: 'Senior Full Stack & Cloud Engineer',
        bio: 'Senior Software Engineer with 5+ years specializing in React, TypeScript, and distributed backend microservices. Passionate about scalable distributed architectures and intuitive user experiences.',
        jobSeekerStatus: 'Actively Looking',
        skills: 'React, TypeScript, Node.js, Python, PostgreSQL, Docker, AWS'
    });

    useEffect(() => {
        setLoading(true);
        apiRequest(`/user/profile?email=${encodeURIComponent(user?.email || 'john.doe@email.com')}`)
            .then(data => {
                if (data) {
                    setProfile(prev => ({
                        ...prev,
                        ...data,
                        headline: data.headline || prev.headline,
                        bio: data.bio || prev.bio,
                        jobSeekerStatus: data.jobSeekerStatus || prev.jobSeekerStatus,
                        skills: data.skills || prev.skills
                    }));
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        try {
            const updated = await apiRequest('/user/profile', {
                method: 'PUT',
                body: {
                    ...profile,
                    email: user?.email || profile.email
                }
            });
            setProfile(prev => ({ ...prev, ...updated }));
            setIsEditing(false);
            setSuccessMsg('Your personal profile has been updated successfully!');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <DashboardLayout role="jobseeker">
            <div className="content-card">
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                    <div>
                        <h4 className="fw-bold mb-1">Personal Career Profile</h4>
                        <p className="text-muted small mb-0">Manage your public credentials, skills, and employment search status.</p>
                    </div>
                    {!isEditing && (
                        <button className="btn btn-outline-primary btn-sm" onClick={() => setIsEditing(true)}>
                            <i className="bi bi-pencil me-1"></i> Edit Profile
                        </button>
                    )}
                </div>

                {error && <div className="alert alert-danger shadow-sm py-2 mb-3" role="alert">{error}</div>}
                {successMsg && <div className="alert alert-success shadow-sm py-2 mb-3" role="alert">{successMsg}</div>}

                <div className="row">
                    <div className="col-md-4 text-center border-end">
                        <div className="bg-primary-subtle text-primary rounded-circle p-4 d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '130px', height: '130px' }}>
                            <i className="bi bi-person-circle display-4"></i>
                        </div>
                        <h5 className="fw-bold mb-1">{profile.firstName} {profile.lastName}</h5>
                        <p className="text-muted small mb-2">{profile.headline}</p>
                        <span className="badge bg-success-subtle text-success border border-success rounded-pill px-3 py-1 mb-4">
                            <i className="bi bi-circle-fill me-1" style={{ fontSize: '0.5rem' }}></i> {profile.jobSeekerStatus}
                        </span>

                        <div className="text-muted small text-start ps-3 border-top pt-3">
                            <div className="mb-2"><i className="bi bi-envelope me-2"></i> {profile.email}</div>
                            <div className="mb-2"><i className="bi bi-telephone me-2"></i> {profile.phone}</div>
                            <div className="mb-2"><i className="bi bi-geo-alt me-2"></i> {profile.location}</div>
                        </div>
                    </div>

                    <div className="col-md-8 ps-md-5 mt-4 mt-md-0">
                        {isEditing ? (
                            <form onSubmit={handleUpdate}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">First Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={profile.firstName}
                                            onChange={e => setProfile({ ...profile, firstName: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Last Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={profile.lastName}
                                            onChange={e => setProfile({ ...profile, lastName: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Professional Headline</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g. Senior Full Stack Engineer"
                                            value={profile.headline}
                                            onChange={e => setProfile({ ...profile, headline: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Job Search Status</label>
                                        <select
                                            className="form-select"
                                            value={profile.jobSeekerStatus}
                                            onChange={e => setProfile({ ...profile, jobSeekerStatus: e.target.value })}
                                        >
                                            <option>Actively Looking</option>
                                            <option>Open to Opportunities</option>
                                            <option>Not Looking</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Phone</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={profile.phone}
                                            onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Location</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={profile.location}
                                            onChange={e => setProfile({ ...profile, location: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label small fw-bold">Skills (comma separated)</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={profile.skills}
                                            onChange={e => setProfile({ ...profile, skills: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label small fw-bold">Bio & Professional Summary</label>
                                        <textarea
                                            className="form-control"
                                            rows="4"
                                            value={profile.bio}
                                            onChange={e => setProfile({ ...profile, bio: e.target.value })}
                                        ></textarea>
                                    </div>
                                    <div className="col-12 pt-2 d-flex gap-2">
                                        <button type="submit" className="btn btn-teal text-white fw-bold px-4">
                                            Save Changes
                                        </button>
                                        <button type="button" className="btn btn-outline-secondary" onClick={() => setIsEditing(false)}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div>
                                <div className="mb-4">
                                    <h6 className="fw-bold text-uppercase text-muted small">About Me</h6>
                                    <p className="mt-1 text-dark lead" style={{ fontSize: '1rem' }}>
                                        {profile.bio}
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <h6 className="fw-bold text-uppercase text-muted small">Core Competencies & Skills</h6>
                                    <div className="d-flex flex-wrap gap-2 mt-2">
                                        {(profile.skills || '').split(',').map((skill, index) => (
                                            <span key={index} className="badge bg-light text-dark border px-3 py-2">
                                                {skill.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default JobSeekerProfile;
