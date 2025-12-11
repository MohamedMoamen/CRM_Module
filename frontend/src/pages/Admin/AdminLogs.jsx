import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";
import AdminNavbar from "../../components/AdminNavbar";

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/logs");
      setLogs(res.data);
    } catch (err) {
      console.error(err);
      setError("Error loading logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (loading) return <p>Loading logs...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <AdminNavbar />

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px" }}>
        <h2>Admin Logs</h2>
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
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} style={{ textAlign: "center", cursor: "pointer" }}>
              <td>{log.id}</td>
              <td>{log.user_name || "-"}</td>
              <td>{log.user_role}</td>
              <td>{log.action_type}</td>
              <td>{log.table_name}</td>
              <td>{new Date(log.created_at).toLocaleString()}</td>
              <td>
                <Link to={`/admin/logs/${log.id}`}>
                <button
                  style={{
                    backgroundColor: "#2196F3",
                    color: "white",
                    padding: "5px 10px",
                    border: "none",
                    borderRadius: "4px",
                    cursor:"pointer"
                  }}
                  onClick={() => navigate(`/admin/logs/${log.id}`)}
                >
                  View Details
                </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
