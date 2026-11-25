import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        users: 0,
        jobs: 0,
        companies: 0,
        alerts: 0,
        activeJobs: 0,
        pendingJobs: 0,
        totalApplications: 0
    });
    const [recentUsers, setRecentUsers] = useState([]);
    const [pendingEmployers, setPendingEmployers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            apiRequest('/admin/stats'),
            apiRequest('/admin/users'),
            apiRequest('/admin/employers/pending')
        ])
            .then(([statsData, usersData, empData]) => {
                if (statsData) setStats(statsData);
                if (usersData) setRecentUsers(usersData.slice(0, 5));
                if (empData) setPendingEmployers(empData);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <DashboardLayout role="admin">
            {/* Stats Row */}
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon blue">
                            <i className="bi bi-people"></i>
                        </div>
                        <div className="stat-value">{stats.users}</div>
                        <div className="stat-label">Total Users</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon green">
                            <i className="bi bi-briefcase"></i>
                        </div>
                        <div className="stat-value">{stats.jobs}</div>
                        <div className="stat-label">Active & Total Jobs</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon orange">
                            <i className="bi bi-building"></i>
                        </div>
                        <div className="stat-value">{stats.companies}</div>
                        <div className="stat-label">Registered Companies</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon teal">
                            <i className="bi bi-shield-check"></i>
                        </div>
                        <div className="stat-value">{stats.alerts + (stats.pendingJobs || 0)}</div>
                        <div className="stat-label">Pending Approvals</div>
                    </div>
                </div>
            </div>

            {/* Pending Verifications Banner if any */}
            {(pendingEmployers.length > 0 || stats.pendingJobs > 0) && (
                <div className="alert alert-warning border-0 shadow-sm d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center">
                        <i className="bi bi-exclamation-triangle-fill fs-3 text-warning me-3"></i>
                        <div>
                            <strong>Pending Action Items:</strong> {pendingEmployers.length} employer verification(s) and {stats.pendingJobs || 0} job post(s) awaiting approval.
                        </div>
                    </div>
                    <Link to="/dashboard/admin/approvals" className="btn btn-sm btn-dark px-3">
                        Review Approvals <i className="bi bi-arrow-right ms-1"></i>
                    </Link>
                </div>
            )}

            <div className="row g-4">
                {/* Recent Users Table */}
                <div className="col-lg-8">
                    <div className="content-card h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="content-title mb-0">Platform Users</h5>
                            <Link to="/dashboard/admin/users" className="btn btn-sm btn-outline-primary">
                                Manage All Users
                            </Link>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>User Name</th>
                                        <th>Role</th>
                                        <th>Date Joined</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentUsers.map(user => (
                                        <tr key={user.id}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="bg-light rounded-circle p-2 me-2 text-primary fw-bold" style={{ width: '36px', height: '36px', textAlign: 'center' }}>
                                                        {user.firstName ? user.firstName[0] : 'U'}
                                                    </div>
                                                    <div>
                                                        <span className="fw-bold">{user.firstName} {user.lastName}</span>
                                                        <div className="text-muted small">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge bg-secondary-subtle text-secondary">
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="small text-muted">{user.joined || '2024-01-01'}</td>
                                            <td>
                                                <span className={`badge rounded-pill ${user.status === 'Active' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                    {user.status || 'Active'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Quick Moderation Actions */}
                <div className="col-lg-4">
                    <div className="content-card h-100">
                        <h5 className="content-title mb-3">Administrator Shortcuts</h5>
                        <div className="d-grid gap-3">
                            <Link to="/dashboard/admin/approvals" className="btn btn-teal text-white py-3 text-start d-flex align-items-center">
                                <i className="bi bi-check-circle-fill fs-4 me-3"></i>
                                <div>
                                    <div className="fw-bold">Review Approval Queue</div>
                                    <small className="opacity-75">Employers & Jobs</small>
                                </div>
                            </Link>

                            <Link to="/dashboard/admin/users" className="btn btn-outline-primary py-3 text-start d-flex align-items-center">
                                <i className="bi bi-people-fill fs-4 me-3"></i>
                                <div>
                                    <div className="fw-bold">Manage User Accounts</div>
                                    <small className="text-muted">Roles & Permissions</small>
                                </div>
                            </Link>

                            <Link to="/dashboard/admin/activity" className="btn btn-outline-dark py-3 text-start d-flex align-items-center">
                                <i className="bi bi-shield-lock-fill fs-4 me-3"></i>
                                <div>
                                    <div className="fw-bold">Inspect Security & Audit Logs</div>
                                    <small className="text-muted">Track administrative actions</small>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
