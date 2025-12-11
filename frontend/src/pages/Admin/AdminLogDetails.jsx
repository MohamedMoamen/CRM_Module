import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/api";
import AdminNavbar from "../../components/AdminNavbar";

export default function AdminLogDetails() {
  const { id } = useParams();
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLog = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/logs/${id}`);
      setLog(res.data);
    } catch (err) {
      console.error(err);
      setError("Error loading log");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLog();
  }, [id]);

  if (loading) return <p>Loading log...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!log) return <p>No log found</p>;

  const renderKeyValue = (data) => {
  if (!data) return <p style={{textAlign:"center"}}>None</p>;

  let parsedData = {};
  try {
    parsedData = typeof data === "string" ? JSON.parse(data) : data;
  } catch (e) {
    parsedData = { raw: data };
  }

  if (Object.keys(parsedData).length === 0) return <p style={{textAlign:"center"}}>None</p>;

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <tbody>
        {Object.entries(parsedData).map(([key, value]) => (
          <tr key={key}>
            <td style={{ border: "1px solid black", padding: "4px" }}>{key}</td>
            <td style={{ border: "1px solid black", padding: "4px" }}>
              {typeof value === "object" ? JSON.stringify(value) : value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};


  return (
    <div>
      <AdminNavbar />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>
        <h2>Log Details - ID {log.id}</h2>
        <Link to="/admin/logs" style={{ textDecoration: "none", color: "white", backgroundColor: "#2196F3", padding: "5px 10px", borderRadius: "4px" }}>Back to Logs</Link>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>
            <th>ID</th>
            <th>User</th>
            <th>Role</th>
            <th>Action Type</th>
            <th>Table Name</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ textAlign: "center" }}>
            <td>{log.id}</td>
            <td>{log.user_name || "-"}</td>
            <td>{log.user_role}</td>
            <td>{log.action_type}</td>
            <td>{log.table_name}</td>
            <td>{new Date(log.created_at).toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

      <h3 style={{ marginTop: "30px" }}>Record Data</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>
            <th style={{ width: "80px", border: "1px solid black", padding: "5px" }}>Record ID</th>
            <th style={{ border: "1px solid black", padding: "5px" }}>Old Data</th>
            <th style={{ border: "1px solid black", padding: "5px" }}>New Data</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ textAlign: "center", border: "1px solid black", padding: "5px" }}>{log.record_id}</td>
            <td style={{ border: "1px solid black", padding: "5px" }}>{renderKeyValue(log.old_data)}</td>
            <td style={{ border: "1px solid black", padding: "5px" }}>{renderKeyValue(log.new_data)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
