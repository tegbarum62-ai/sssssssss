import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api';

const EmployerProfile = () => {
    const { user, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const [profile, setProfile] = useState({
        name: 'TechCorp Solutions',
        description: 'Leading global technology solutions provider specializing in cloud computing, modern web platforms, and AI engineering.',
        email: user?.email || 'techcorp@company.com',
        location: 'Seattle, WA',
        website: 'https://techcorp.com',
        phone: '+1 206-555-0100',
        industry: 'Technology',
        size: '250-500 employees',
        status: 'APPROVED',
        foundedYear: 2018
    });

    useEffect(() => {
        setLoading(true);
        apiRequest('/employer/company')
            .then(data => {
                if (data) {
                    setProfile(prev => ({
                        ...prev,
                        ...data,
                        companyName: data.name || prev.name
                    }));
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        try {
            const updated = await apiRequest('/employer/company', {
                method: 'PUT',
                body: {
                    name: profile.name || profile.companyName,
                    description: profile.description,
                    location: profile.location,
                    website: profile.website,
                    phone: profile.phone,
                    industry: profile.industry,
                    size: profile.size
                }
            });
            setProfile(prev => ({ ...prev, ...updated }));
            setIsEditing(false);
            setSuccessMsg('Company profile updated successfully!');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <DashboardLayout role="employer">
            <div className="content-card">
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                    <div>
                        <h4 className="fw-bold mb-1">Company Profile & Branding</h4>
                        <p className="text-muted small mb-0">Manage public organization presence and recruiting identity.</p>
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
                        <div className="bg-primary-subtle rounded-circle p-4 d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '130px', height: '130px' }}>
                            <i className="bi bi-building display-4 text-primary"></i>
                        </div>
                        <h5 className="fw-bold mb-1">{profile.name || profile.companyName}</h5>
                        <p className="text-muted small mb-2">{profile.industry || 'Technology'}</p>
                        <span className="badge bg-success-subtle text-success border border-success rounded-pill px-3 py-1 mb-3">
                            <i className="bi bi-check-circle-fill me-1"></i> Verified & Approved
                        </span>
                        <div className="text-muted small">
                            <div><i className="bi bi-geo-alt me-1"></i> {profile.location}</div>
                            <div><i className="bi bi-people me-1"></i> {profile.size}</div>
                        </div>
                    </div>

                    <div className="col-md-8 ps-md-5 mt-4 mt-md-0">
                        {isEditing ? (
                            <form onSubmit={handleUpdate}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Company Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={profile.name || profile.companyName || ''}
                                            onChange={e => setProfile({ ...profile, name: e.target.value, companyName: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Industry</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={profile.industry || ''}
                                            onChange={e => setProfile({ ...profile, industry: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Location</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={profile.location || ''}
                                            onChange={e => setProfile({ ...profile, location: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Website</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={profile.website || ''}
                                            onChange={e => setProfile({ ...profile, website: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Contact Phone</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={profile.phone || ''}
                                            onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Company Size</label>
                                        <select
                                            className="form-select"
                                            value={profile.size || '50-100 employees'}
                                            onChange={e => setProfile({ ...profile, size: e.target.value })}
                                        >
                                            <option>1-10 employees</option>
                                            <option>10-50 employees</option>
                                            <option>50-100 employees</option>
                                            <option>100-250 employees</option>
                                            <option>250-500 employees</option>
                                            <option>500+ employees</option>
                                        </select>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label small fw-bold">About the Organization</label>
                                        <textarea
                                            className="form-control"
                                            rows="4"
                                            value={profile.description || ''}
                                            onChange={e => setProfile({ ...profile, description: e.target.value })}
                                        ></textarea>
                                    </div>
                                    <div className="col-12 pt-2 d-flex gap-2">
                                        <button type="submit" className="btn btn-teal text-white fw-bold px-4">
                                            Save Profile Changes
                                        </button>
                                        <button type="button" className="btn btn-outline-secondary" onClick={() => setIsEditing(false)}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div className="profile-details">
                                <div className="mb-4">
                                    <h6 className="fw-bold text-uppercase text-muted small">Company Overview</h6>
                                    <p className="mt-1 text-dark lead" style={{ fontSize: '1rem' }}>
                                        {profile.description}
                                    </p>
                                </div>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="small text-muted fw-bold">Website</div>
                                        <a href={profile.website} target="_blank" rel="noreferrer" className="text-primary text-decoration-none">
                                            {profile.website}
                                        </a>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="small text-muted fw-bold">Direct Phone</div>
                                        <div>{profile.phone}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="small text-muted fw-bold">Organization Size</div>
                                        <div>{profile.size}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="small text-muted fw-bold">Verification Status</div>
                                        <span className="badge bg-success">Active & Approved</span>
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

export default EmployerProfile;
