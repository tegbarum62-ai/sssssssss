import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { apiRequest } from '../api';

const JobSeekerAlerts = () => {
    const [activeTab, setActiveTab] = useState('notifications');
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alertsEnabled, setAlertsEnabled] = useState(true);
    const [preferences, setPreferences] = useState({
        keywords: 'React, Node.js, Cloud, DevOps',
        location: 'Remote',
        type: 'Full-time',
        emailAlert: true,
        pushAlert: true
    });
    const [successMsg, setSuccessMsg] = useState('');
    const [error, setError] = useState('');

    const loadData = () => {
        setLoading(true);
        Promise.all([
            apiRequest('/notifications?userId=2'),
            apiRequest('/jobseeker/alerts')
        ])
            .then(([notes, alertPrefs]) => {
                if (notes) setNotifications(notes);
                if (alertPrefs && alertPrefs.keywords) {
                    setPreferences(alertPrefs);
                    setAlertsEnabled(alertPrefs.alertsEnabled !== false);
                }
                setError('');
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSavePreferences = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        try {
            await apiRequest('/jobseeker/alerts', {
                method: 'PUT',
                body: { ...preferences, alertsEnabled }
            });
            setSuccessMsg('Job alert preferences saved successfully!');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await apiRequest('/notifications/read-all', { method: 'POST' });
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            setSuccessMsg('All notifications marked as read.');
        } catch (err) {
            setError(err.message);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <DashboardLayout role="jobseeker">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div>
                    <h3 className="fw-bold mb-1">Notifications & Job Alerts</h3>
                    <p className="text-muted small mb-0">Stay updated on your application status, interviews, and matching vacancies.</p>
                </div>
                <div className="btn-group">
                    <button
                        className={`btn ${activeTab === 'notifications' ? 'btn-teal text-white fw-bold' : 'btn-outline-secondary'}`}
                        onClick={() => setActiveTab('notifications')}
                    >
                        <i className="bi bi-bell-fill me-1"></i>
                        Notifications {unreadCount > 0 && <span className="badge bg-danger ms-1">{unreadCount}</span>}
                    </button>
                    <button
                        className={`btn ${activeTab === 'preferences' ? 'btn-teal text-white fw-bold' : 'btn-outline-secondary'}`}
                        onClick={() => setActiveTab('preferences')}
                    >
                        <i className="bi bi-sliders me-1"></i> Alert Settings
                    </button>
                </div>
            </div>

            {error && <div className="alert alert-danger shadow-sm py-2 mb-3" role="alert">{error}</div>}
            {successMsg && <div className="alert alert-success shadow-sm py-2 mb-3" role="alert">{successMsg}</div>}

            {activeTab === 'notifications' && (
                <div className="content-card">
                    <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                        <h5 className="content-title mb-0">Recent Alerts & Hiring Updates</h5>
                        {unreadCount > 0 && (
                            <button className="btn btn-sm btn-outline-secondary" onClick={handleMarkAllRead}>
                                <i className="bi bi-check2-all me-1"></i> Mark All as Read
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status" />
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <i className="bi bi-bell-slash fs-2 d-block mb-2 text-secondary"></i>
                            No notifications at this time.
                        </div>
                    ) : (
                        <div className="d-grid gap-3">
                            {notifications.map(note => (
                                <div
                                    key={note.id}
                                    className={`p-3 border rounded-3 d-flex align-items-start gap-3 ${
                                        !note.isRead ? 'bg-light border-primary' : 'bg-white'
                                    }`}
                                >
                                    <div
                                        className={`rounded-circle p-2 d-flex align-items-center justify-content-center text-white ${
                                            note.type === 'INTERVIEW'
                                                ? 'bg-success'
                                                : note.type === 'APPLICATION_STATUS'
                                                ? 'bg-primary'
                                                : 'bg-warning text-dark'
                                        }`}
                                        style={{ width: '42px', height: '42px', minWidth: '42px' }}
                                    >
                                        <i className={`bi ${
                                            note.type === 'INTERVIEW'
                                                ? 'bi-calendar-check-fill'
                                                : note.type === 'APPLICATION_STATUS'
                                                ? 'bi-briefcase-fill'
                                                : 'bi-lightning-charge-fill'
                                        } fs-5`}></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <h6 className="fw-bold mb-0 text-dark">{note.title}</h6>
                                            <small className="text-muted">{new Date(note.createdAt).toLocaleDateString()}</small>
                                        </div>
                                        <p className="text-muted small mb-0">{note.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'preferences' && (
                <div className="row g-4">
                    <div className="col-lg-7">
                        <div className="content-card">
                            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                <h5 className="fw-bold mb-0">Job Alert Matching Criteria</h5>
                                <div className="form-check form-switch">
                                    <label className="form-check-label small text-muted me-2" htmlFor="alertToggle">
                                        {alertsEnabled ? 'Active' : 'Paused'}
                                    </label>
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="alertToggle"
                                        checked={alertsEnabled}
                                        onChange={() => setAlertsEnabled(!alertsEnabled)}
                                    />
                                </div>
                            </div>

                            <form onSubmit={handleSavePreferences} className={!alertsEnabled ? 'opacity-50' : ''}>
                                <div className="mb-4">
                                    <label className="form-label small fw-bold">Keywords & Target Roles</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={preferences.keywords}
                                        onChange={e => setPreferences({ ...preferences, keywords: e.target.value })}
                                        disabled={!alertsEnabled}
                                    />
                                    <div className="form-text small">e.g. React, Node.js, AI Engineer, Solutions Architect</div>
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Preferred Location</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={preferences.location}
                                            onChange={e => setPreferences({ ...preferences, location: e.target.value })}
                                            disabled={!alertsEnabled}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Job Type</label>
                                        <select
                                            className="form-select"
                                            value={preferences.type}
                                            onChange={e => setPreferences({ ...preferences, type: e.target.value })}
                                            disabled={!alertsEnabled}
                                        >
                                            <option>Full-time</option>
                                            <option>Part-time</option>
                                            <option>Contract</option>
                                            <option>Internship</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-4 pt-2">
                                    <label className="form-label small fw-bold">Alert Channels</label>
                                    <div className="d-flex gap-4">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="emailAlert"
                                                checked={preferences.emailAlert}
                                                onChange={e => setPreferences({ ...preferences, emailAlert: e.target.checked })}
                                                disabled={!alertsEnabled}
                                            />
                                            <label className="form-check-label small" htmlFor="emailAlert">
                                                Instant Email Delivery
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="pushAlert"
                                                checked={preferences.pushAlert}
                                                onChange={e => setPreferences({ ...preferences, pushAlert: e.target.checked })}
                                                disabled={!alertsEnabled}
                                            />
                                            <label className="form-check-label small" htmlFor="pushAlert">
                                                In-App Notification Feed
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-teal text-white w-100 py-2 fw-bold"
                                    disabled={!alertsEnabled}
                                >
                                    Save Alert Preferences
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="col-lg-5">
                        <div className="content-card border-0 bg-light p-4">
                            <h6 className="fw-bold mb-2 text-primary">
                                <i className="bi bi-info-circle me-2"></i> How Matching Works
                            </h6>
                            <p className="small text-muted mb-0">
                                Whenever an employer posts any job matching your keyword profile, location, or skills criteria, you will immediately receive an alert so you can be the first to apply with your saved CV.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default JobSeekerAlerts;
