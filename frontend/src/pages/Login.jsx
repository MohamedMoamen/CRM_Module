import { useState } from 'react';
import api, { setToken } from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/login', { email, password });
            const { token, user } = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setToken(token);

            if (user.role === 'admin') navigate('/admin/dashboard');
            else if (user.role === 'sales') navigate('/sales/leads');
            else if (user.role === 'support') navigate('/support');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }  finally {
        setLoading(false);
    }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{color:'red'}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
                <button type="submit" disabled={loading}>Login</button>
            </form>
        </div>
    );
}
