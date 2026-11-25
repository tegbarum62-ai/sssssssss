import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { apiRequest } from '../api';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const loadUsers = () => {
        setLoading(true);
        apiRequest('/admin/users')
            .then(data => {
                setUsers(data);
                setError('');
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleStatus = async (id, newStatus) => {
        setError('');
        setSuccessMsg('');
        try {
            await apiRequest(`/admin/users/${id}/status`, {
                method: 'PUT',
                body: { status: newStatus }
            });
            setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
            setSuccessMsg(`User status updated to ${newStatus}`);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRoleChange = async (id, newRole) => {
        setError('');
        setSuccessMsg('');
        try {
            await apiRequest(`/admin/users/${id}/role`, {
                method: 'PUT',
                body: { role: newRole }
            });
            setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
            setSuccessMsg(`User role updated to ${newRole}`);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id, email) => {
        if (!window.confirm(`Are you sure you want to permanently delete user "${email}"?`)) {
            return;
        }
        setError('');
        setSuccessMsg('');
        try {
            await apiRequest(`/admin/users/${id}`, { method: 'DELETE' });
            setUsers(users.filter(u => u.id !== id));
            setSuccessMsg(`User ${email} deleted successfully.`);
        } catch (err) {
            setError(err.message);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            (user.firstName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.lastName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.email || '').toLowerCase().includes(searchQuery.toLowerCase());
        const userRole = (user.role || '').toUpperCase();
        const matchesRole =
            selectedRole === 'All' ||
            (selectedRole === 'EMPLOYER' && userRole === 'EMPLOYER') ||
            (selectedRole === 'JOBSEEKER' && userRole === 'JOBSEEKER') ||
            (selectedRole === 'ADMIN' && userRole === 'ADMIN');
        return matchesSearch && matchesRole;
    });

    return (
        <DashboardLayout role="admin">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div>
                    <h3 className="fw-bold mb-1">User Management</h3>
                    <p className="text-muted small mb-0">View, moderate, and manage platform permissions for all users.</p>
                </div>
                <div className="d-flex gap-2">
                    <div className="input-group">
                        <span className="input-group-text bg-white border-end-0">
                            <i className="bi bi-search text-muted"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control border-start-0"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{ maxWidth: '240px' }}
                        />
                    </div>
                    <select
                        className="form-select"
                        style={{ width: '160px' }}
                        value={selectedRole}
                        onChange={e => setSelectedRole(e.target.value)}
                    >
                        <option value="All">All Roles</option>
                        <option value="JOBSEEKER">Job Seekers</option>
                        <option value="EMPLOYER">Employers</option>
                        <option value="ADMIN">Administrators</option>
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
                                <th>User</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Verified</th>
                                <th>Joined</th>
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
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-muted">
                                        No users found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div
                                                    className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold me-3"
                                                    style={{ width: '40px', height: '40px', minWidth: '40px' }}
                                                >
                                                    {user.firstName ? user.firstName.charAt(0) : 'U'}
                                                </div>
                                                <div>
                                                    <div className="fw-bold text-dark">
                                                        {user.firstName} {user.lastName}
                                                    </div>
                                                    <div className="text-muted small">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <select
                                                className="form-select form-select-sm"
                                                style={{ width: '135px' }}
                                                value={user.role}
                                                disabled={user.id === 1}
                                                onChange={e => handleRoleChange(user.id, e.target.value)}
                                            >
                                                <option value="JOBSEEKER">Job Seeker</option>
                                                <option value="EMPLOYER">Employer</option>
                                                <option value="ADMIN">Admin</option>
                                            </select>
                                        </td>
                                        <td>
                                            <span
                                                className={`badge rounded-pill ${
                                                    user.status === 'Active'
                                                        ? 'bg-success'
                                                        : user.status === 'Suspended'
                                                        ? 'bg-warning text-dark'
                                                        : 'bg-secondary'
                                                }`}
                                            >
                                                {user.status || 'Active'}
                                            </span>
                                        </td>
                                        <td>
                                            {user.isVerified ? (
                                                <span className="badge bg-info-subtle text-info border border-info">
                                                    <i className="bi bi-patch-check-fill me-1"></i> Verified
                                                </span>
                                            ) : (
                                                <span className="badge bg-secondary-subtle text-secondary">Unverified</span>
                                            )}
                                        </td>
                                        <td className="small text-muted">{user.joined || '2024-01-01'}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                {user.status === 'Suspended' ? (
                                                    <button
                                                        className="btn btn-sm btn-outline-success"
                                                        onClick={() => handleStatus(user.id, 'Active')}
                                                    >
                                                        Activate
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn btn-sm btn-outline-warning"
                                                        disabled={user.id === 1}
                                                        onClick={() => handleStatus(user.id, 'Suspended')}
                                                    >
                                                        Suspend
                                                    </button>
                                                )}
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    disabled={user.id === 1}
                                                    onClick={() => handleDelete(user.id, user.email)}
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
        </DashboardLayout>
    );
};

export default AdminUsers;
