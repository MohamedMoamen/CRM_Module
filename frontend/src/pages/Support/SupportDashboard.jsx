import React, { useEffect, useState } from "react";
import api from "../../api/api"; 
import SupportNavbar from "../../components/SupportNavbar";

const SupportDashboard = () => {
  const [counts, setCounts] = useState({
    open: 0,
    in_progress: 0,
    closed: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/support/dashboard"); 
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
      <SupportNavbar />

      {/* Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          padding: 20,
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <Card title="Open Tickets" value={counts.open} color="#FFD700" />
        <Card title="In Progress Tickets" value={counts.in_progress} color="#FF9800" />
        <Card title="Closed Tickets" value={counts.closed} color="#4CAF50" />
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

export default SupportDashboard;
