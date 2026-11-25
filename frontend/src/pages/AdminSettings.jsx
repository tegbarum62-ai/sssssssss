import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { apiRequest } from '../api';

const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [settings, setSettings] = useState({
        websiteName: 'ET job connect',
        supportEmail: 'support@etjobconnect.com',
        language: 'English',
        maintenanceMode: false,
        allowEmployerSelfRegistration: true,
        requireEmployerVerification: true,
        requireJobApproval: true,
        emailAlertsEnabled: true
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        apiRequest('/admin/settings')
            .then(data => {
                if (data) setSettings(data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccessMsg('');
        try {
            await apiRequest('/admin/settings', {
                method: 'PUT',
                body: settings
            });
            setSuccessMsg('System configuration settings saved successfully!');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <DashboardLayout role="admin">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div>
                    <h3 className="fw-bold mb-1">System Configuration & Settings</h3>
                    <p className="text-muted small mb-0">Manage platform parameters, compliance policies, roles, and notification controls.</p>
                </div>
            </div>

            {error && <div className="alert alert-danger shadow-sm py-2 mb-3" role="alert">{error}</div>}
            {successMsg && <div className="alert alert-success shadow-sm py-2 mb-3" role="alert">{successMsg}</div>}

            <div className="content-card">
                <div className="border-bottom mb-4">
                    <ul className="nav nav-tabs border-0">
                        <li className="nav-item">
                            <button
                                className={`nav-link border-0 fw-bold ${activeTab === 'general' ? 'text-primary border-bottom border-primary active' : 'text-muted'}`}
                                onClick={() => setActiveTab('general')}
                            >
                                <i className="bi bi-gear-fill me-1"></i> General Settings
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link border-0 fw-bold ${activeTab === 'roles' ? 'text-primary border-bottom border-primary active' : 'text-muted'}`}
                                onClick={() => setActiveTab('roles')}
                            >
                                <i className="bi bi-shield-lock-fill me-1"></i> Roles & Permissions
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link border-0 fw-bold ${activeTab === 'notifications' ? 'text-primary border-bottom border-primary active' : 'text-muted'}`}
                                onClick={() => setActiveTab('notifications')}
                            >
                                <i className="bi bi-bell-fill me-1"></i> Notification Rules
                            </button>
                        </li>
                    </ul>
                </div>

                {activeTab === 'general' && (
                    <div className="p-2">
                        <h5 className="mb-4 fw-bold">Platform Configuration</h5>
                        <form onSubmit={handleSave}>
                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold">Website Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={settings.websiteName}
                                        onChange={e => setSettings({ ...settings, websiteName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold">Support Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={settings.supportEmail}
                                        onChange={e => setSettings({ ...settings, supportEmail: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold">Default System Language</label>
                                    <select
                                        className="form-select"
                                        value={settings.language}
                                        onChange={e => setSettings({ ...settings, language: e.target.value })}
                                    >
                                        <option>English</option>
                                        <option>Amharic</option>
                                        <option>French</option>
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold">Timezone</label>
                                    <select className="form-select" defaultValue="(GMT+03:00) East Africa Time (EAT)">
                                        <option>(GMT+03:00) East Africa Time (EAT)</option>
                                        <option>(GMT+00:00) UTC</option>
                                        <option>(GMT-05:00) Eastern Time (US)</option>
                                    </select>
                                </div>
                            </div>

                            <h6 className="fw-bold mb-3">Moderation & Approval Policies</h6>
                            <div className="mb-4">
                                <div className="form-check form-switch mb-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="reqEmpVerif"
                                        checked={settings.requireEmployerVerification}
                                        onChange={e => setSettings({ ...settings, requireEmployerVerification: e.target.checked })}
                                    />
                                    <label className="form-check-label fw-semibold" htmlFor="reqEmpVerif">
                                        Require Administrator Business Verification before Employers can post jobs
                                    </label>
                                </div>
                                <div className="form-check form-switch mb-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="reqJobAppr"
                                        checked={settings.requireJobApproval}
                                        onChange={e => setSettings({ ...settings, requireJobApproval: e.target.checked })}
                                    />
                                    <label className="form-check-label fw-semibold" htmlFor="reqJobAppr">
                                        Route new job posts through the Admin Job Approval Queue
                                    </label>
                                </div>
                                <div className="form-check form-switch mb-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="maintenanceToggle"
                                        checked={settings.maintenanceMode}
                                        onChange={e => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                                    />
                                    <label className="form-check-label fw-semibold text-danger" htmlFor="maintenanceToggle">
                                        Maintenance Mode (Restricts access to system administrators)
                                    </label>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-teal text-white fw-bold px-4 py-2" disabled={saving}>
                                {saving ? 'Saving...' : 'Save System Settings'}
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === 'roles' && (
                    <div className="p-2">
                        <h5 className="mb-3 fw-bold">Role & Permission Matrix</h5>
                        <p className="text-muted small mb-4">Core system responsibilities segregated by security access levels.</p>
                        <div className="table-responsive">
                            <table className="table table-bordered align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Role</th>
                                        <th>Key Responsibilities</th>
                                        <th>Access Level</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>Admin</strong></td>
                                        <td>
                                            <span className="badge bg-primary me-1">System Monitoring</span>
                                            <span className="badge bg-primary me-1">Manage Users</span>
                                            <span className="badge bg-primary me-1">Job Approvals</span>
                                            <span className="badge bg-primary me-1">Audit Logs</span>
                                            <span className="badge bg-primary me-1">Settings</span>
                                        </td>
                                        <td>Master Full Access</td>
                                        <td><span className="badge bg-success">Active</span></td>
                                    </tr>
                                    <tr>
                                        <td><strong>Employer</strong></td>
                                        <td>
                                            <span className="badge bg-secondary me-1">Register / Login</span>
                                            <span className="badge bg-secondary me-1">Company Profile</span>
                                            <span className="badge bg-secondary me-1">Post Jobs</span>
                                            <span className="badge bg-secondary me-1">Review CVs</span>
                                            <span className="badge bg-secondary me-1">Shortlist / Interview / Approve</span>
                                        </td>
                                        <td>Employer Portal</td>
                                        <td><span className="badge bg-success">Active</span></td>
                                    </tr>
                                    <tr>
                                        <td><strong>Job Seeker</strong></td>
                                        <td>
                                            <span className="badge bg-secondary me-1">Register / Login</span>
                                            <span className="badge bg-secondary me-1">Profile & CV Upload</span>
                                            <span className="badge bg-secondary me-1">Search & Apply</span>
                                            <span className="badge bg-secondary me-1">Track Applications</span>
                                            <span className="badge bg-secondary me-1">Notifications</span>
                                        </td>
                                        <td>Applicant Portal</td>
                                        <td><span className="badge bg-success">Active</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div className="p-2">
                        <h5 className="mb-3 fw-bold">Automated Notification Rules</h5>
                        <p className="text-muted small mb-4">Triggers that dispatch notifications to job seekers and employers.</p>
                        <div className="d-grid gap-3">
                            <div className="p-3 border rounded-3 bg-light-subtle d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="fw-bold text-dark">Job Application Submission</div>
                                    <small className="text-muted">Notifies employer when a job seeker applies for an active job post.</small>
                                </div>
                                <span className="badge bg-success">Enabled</span>
                            </div>
                            <div className="p-3 border rounded-3 bg-light-subtle d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="fw-bold text-dark">Application Status Changes (Shortlist / Approve / Reject)</div>
                                    <small className="text-muted">Dispatches immediate alerts to job seekers when the employer updates their candidacy.</small>
                                </div>
                                <span className="badge bg-success">Enabled</span>
                            </div>
                            <div className="p-3 border rounded-3 bg-light-subtle d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="fw-bold text-dark">Interview Scheduling Alert</div>
                                    <small className="text-muted">Sends meeting calendar link, date, and instructions to the candidate.</small>
                                </div>
                                <span className="badge bg-success">Enabled</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AdminSettings;
