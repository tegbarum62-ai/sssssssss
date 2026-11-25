const API_BASE = '/api';

export const apiRequest = async (path, options = {}) => {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const headers = { ...options.headers };
    let body = options.body;

    if (body !== undefined && typeof body !== 'string') {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(body);
    }

    if (user?.token) {
        headers.Authorization = `Bearer ${user.token}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
        body
    });
    const responseText = await response.text();
    let data = responseText;

    if (responseText) {
        try {
            data = JSON.parse(responseText);
        } catch {
            data = responseText;
        }
    }

    if (!response.ok) {
        const message = typeof data === 'string' ? data : data.message || 'The request could not be completed.';
        throw new Error(message);
    }

    return data;
};
