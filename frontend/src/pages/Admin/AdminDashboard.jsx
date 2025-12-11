import React, { useEffect, useState } from "react";
import api from "../../api/api"; 
import AdminNavbar from "../../components/AdminNavbar";
import { Link } from "react-router-dom";
const AdminDashboard = () => {
  const [counts, setCounts] = useState({
    sales_users: 0,
    support_users: 0,
    leads: 0,
    customers: 0,
    deals: 0,
    tickets: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/dashboard"); 

      setCounts(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <AdminNavbar />

      {/* Cards */}
      <div
        style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
                gap: "20px",
                padding: 20,
                maxWidth: 1200,
                margin: "0 auto",
              }}
      >
         <Link to="/admin/sales" style={{textDecoration:"none"}}> <Card  title="Sales Users" value={counts.sales_users} color="#4caf50" /> </Link>
         <Link to="/admin/support" style={{textDecoration:"none"}}  > <Card title="Support Users" value={counts.support_users} color="#2196f3" /> </Link>
         <Link to="/admin/leads" style={{textDecoration:"none"}} > <Card title="Leads" value={counts.leads} color="#ff9800" /> </Link>
         <Link to="/admin/customers" style={{textDecoration:"none"}} > <Card title="Customers" value={counts.customers} color="#9c27b0" /> </Link>
         <Link to="/admin/deals" style={{textDecoration:"none"}} > <Card title="Deals" value={counts.deals} color="#009688" /> </Link>
         <Link to="/admin/tickets" style={{textDecoration:"none"}} > <Card title="Tickets" value={counts.tickets} color="#f44336" /> </Link>
      </div>

    </div>
  );
};

const Card = ({ title, value, color }) => {
  return (
    <div
      style={{
        padding: 20,
        height: 150,
        backgroundColor: color,
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      }}
    >
      <h3>{title}</h3>
      <p style={{ fontSize: 32, margin: 0 }}>{value}</p>
    </div>
  );
};

export default AdminDashboard;
