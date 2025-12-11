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
            else if (user.role === 'sales') navigate('/sales/dashboard');
            else if (user.role === 'support') navigate('/support/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }  finally {
        setLoading(false);
    }
    };

    return (
        <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              backgroundColor: "#f5f5f5"
            }}
          >
            <div
             style={{
                backgroundColor: "white",
                padding: "40px",
                borderRadius: "8px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                width: "350px",
                textAlign: "center"
              }}
            >
              <h2 style={{ marginBottom: "30px" }}>Login</h2>

              {error && <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>}

              <form onSubmit={handleSubmit} style={{ width:"100%",display: "flex", flexDirection: "column", gap: "15px" }}>
                <div style={{ textAlign: "left" }}>
                  <label htmlFor="email" style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter Your Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "14px"
                    }}
                  />
                </div>

                <div style={{ textAlign: "left" }}>
                  <label htmlFor="password" style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter Your Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "14px"
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    marginTop: "10px",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "none",
                    backgroundColor: "#2196F3",
                    color: "white",
                    fontWeight: "500",
                    cursor: "pointer",
                    width:"100%"
                  }}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            </div>
        </div>

    );
}
