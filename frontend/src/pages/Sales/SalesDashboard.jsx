import React, { useEffect, useState } from "react";
import api from "../../api/api"; 
import { Link } from "react-router-dom";
import SalesNavbar from "../../components/SalesNavbar";

const SalesDashboard = () => {
  const [counts, setCounts] = useState({
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
      const res = await api.get("/sales/dashboard"); 
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
      <SalesNavbar />

      {/* Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)", // 2 في الصف، ممكن تعدل حسب حجم الشاشة
          gap: "20px",
          padding: 20,
          maxWidth: 800,
          margin: "0 auto",
        }}
      >
        <Link to="/sales/leads" style={{ textDecoration: "none" }}>
          <Card title="Leads" value={counts.leads} color="#ff9800" />
        </Link>
        <Link to="/sales/customers" style={{ textDecoration: "none" }}>
          <Card title="Customers" value={counts.customers} color="#9c27b0" />
        </Link>
        <Link to="/sales/deals" style={{ textDecoration: "none" }}>
          <Card title="Deals" value={counts.deals} color="#009688" />
        </Link>
        <Link to="/sales/tickets" style={{ textDecoration: "none" }}>
          <Card title="Tickets" value={counts.tickets} color="#f44336" />
        </Link>
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

export default SalesDashboard;
