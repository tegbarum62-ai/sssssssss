import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiRequest } from '../api'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [roleLabel, setRoleLabel] = useState('jobseeker');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            const response = await apiRequest('/auth/login', {
                method: 'POST',
                body: { email, password }
            });
            const role = response.role?.replace('ROLE_', '').toLowerCase();
            const authenticatedUser = {
                id: response.userId,
                email: response.email,
                name: `${response.firstName} ${response.lastName}`.trim(),
                role,
                isVerified: response.isVerified,
                token: response.accessToken
            };
            login(authenticatedUser);
            navigate(role === 'admin' ? '/dashboard/admin' : role === 'employer' ? '/dashboard/employer' : '/');
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container py-5 mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card border-0 shadow p-4 rounded-4">
                        <h3 className="fw-bold text-center mb-4">Welcome Back</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control form-control-lg"
                                    value={email}
                                    placeholder="e.g. john@example.com"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control form-control-lg"
                                    value={password}
                                    placeholder="••••••••"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Login As</label>
                                <select
                                    className="form-select"
                                    value={roleLabel}
                                    onChange={(e) => setRoleLabel(e.target.value)}
                                >
                                    <option value="jobseeker">Job Seeker</option>
                                    <option value="employer">Employer</option>
                                </select>
                            </div>

                            {error && <div className="alert alert-danger" role="alert">{error}</div>}
                            <button type="submit" className="btn btn-primary w-100 btn-lg mb-4 mt-2" disabled={submitting}>
                                {submitting ? 'Signing in...' : 'Login'}
                            </button>

                            <p className="text-center text-muted">Don't have an account? <a href="/register" className='text-decoration-none fw-bold'>Sign up</a></p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
