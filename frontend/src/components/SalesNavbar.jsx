import { NavLink, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function SalesNavbar() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post('/logout');
            localStorage.removeItem('token');
            navigate('/');
        } catch (error) {
            console.log("Logout Error", error);
        }
    };

    const linkStyle = ({ isActive }) => ({
        padding: "10px 15px",
        textDecoration: "none",
        color: isActive ? "blue" : "#333",
        fontWeight: isActive ? "bold" : "normal",
    });

    return (
        <header style={{
            background: "#f5f5f5",
            padding: "15px",
            borderBottom: "1px solid #ddd",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
        }}>
            
            <nav style={{ display: "flex", gap: "20px" }}>
                <NavLink to="/sales/dashboard" style={linkStyle}>Dashboard</NavLink>
                <NavLink to="/sales/leads" style={linkStyle}>Leads</NavLink>
                <NavLink to="/sales/customers" style={linkStyle}>Customers</NavLink>
                <NavLink to="/sales/deals" style={linkStyle}>Deals</NavLink>
                <NavLink to="/sales/tickets" style={linkStyle}>Tickets</NavLink>
            </nav>

            <button 
                onClick={handleLogout} 
                style={{
                    padding: "8px 12px",
                    background: "crimson",
                    border: "none",
                    color: "#fff",
                    borderRadius: "5px",
                    cursor: "pointer"
                }}
            >
                Logout
            </button>
        </header>
    );
}