import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children, role }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    // Define sidebar items based on role
    const sidebarItems = {
        jobseeker: [
            { icon: 'bi-grid-fill', label: 'Dashboard & Analytics', path: '/dashboard/jobseeker' },
            { icon: 'bi-briefcase-fill', label: 'Applied & History', path: '/dashboard/jobseeker/applied' },
            { icon: 'bi-file-earmark-person-fill', label: 'My CV & Builder', path: '/dashboard/jobseeker/cv' },
            { icon: 'bi-bell-fill', label: 'Alerts & Notifications', path: '/dashboard/jobseeker/alerts' },
            { icon: 'bi-search', label: 'Find Jobs', path: '/jobs' },
            { icon: 'bi-person-circle', label: 'My Profile', path: '/dashboard/jobseeker/profile' },
        ],
        employer: [
            { icon: 'bi-grid-fill', label: 'Dashboard', path: '/dashboard/employer' },
            { icon: 'bi-plus-circle-fill', label: 'Post Any Job', path: '/dashboard/employer/post-job' },
            { icon: 'bi-briefcase-fill', label: 'Manage Jobs', path: '/dashboard/employer/jobs' },
            { icon: 'bi-people-fill', label: 'Applicants & Interviews', path: '/dashboard/employer/applications' },
            { icon: 'bi-building', label: 'Company Profile', path: '/dashboard/employer/profile' },
        ],
        admin: [
            { icon: 'bi-grid-fill', label: 'Dashboard', path: '/dashboard/admin' },
            { icon: 'bi-check-circle-fill', label: 'Approvals & Queues', path: '/dashboard/admin/approvals' },
            { icon: 'bi-briefcase-fill', label: 'Jobs, Activity & Audit', path: '/dashboard/admin/activity' },
            { icon: 'bi-people-fill', label: 'Manage All Users', path: '/dashboard/admin/users' },
            { icon: 'bi-gear-fill', label: 'Settings', path: '/dashboard/admin/settings' },
        ]
    };

    const items = sidebarItems[role] || [];

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <Link to="/" className="sidebar-brand text-decoration-none d-flex align-items-center gap-2">
                    <img src="/src/assets/logo.png" alt="ET job connect" style={{ height: '32px', width: 'auto', background: 'white', borderRadius: '4px', padding: '2px' }} />
                    <span className="fw-bold">ET job connect</span>
                </Link>

                <ul className="sidebar-menu">
                    {items.map((item, index) => (
                        <li key={index} className="sidebar-item">
                            <Link
                                to={item.path}
                                className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                            >
                                <i className={`bi ${item.icon}`}></i>
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                    {/* Logout at bottom */}
                    <li className="sidebar-item mt-auto">
                        <button onClick={logout} className="sidebar-link w-100 border-0 bg-transparent text-start">
                            <i className="bi bi-box-arrow-right"></i>
                            <span>Logout</span>
                        </button>
                    </li>
                </ul>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                {/* Header */}
                <header className="dashboard-header">
                    <div className="welcome-text">
                        <h2 className="mb-1">Welcome back, {user?.name || (role ? role.toUpperCase() : 'User')}!</h2>
                        <p className="text-muted small mb-0">Role: <span className="badge bg-primary-subtle text-primary text-uppercase">{user?.role || role}</span> | System Online</p>
                    </div>

                    <div className="header-actions">
                        <div className="user-profile-header d-flex align-items-center gap-2">
                            <div className="user-avatar-small bg-primary text-white fw-bold d-flex align-items-center justify-content-center rounded-circle" style={{ width: '36px', height: '36px' }}>
                                {user?.name ? user.name.charAt(0) : 'U'}
                            </div>
                            <div className="d-none d-md-block text-start">
                                <div className="small fw-bold text-dark">{user?.name || 'Account'}</div>
                                <div className="small text-muted" style={{ fontSize: '0.75rem' }}>{user?.email}</div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-4">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
