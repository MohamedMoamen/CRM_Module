import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import AdminNavbar from "../components/AdminNavbar";
import SalesNavbar from "../components/SalesNavbar";
import SupportNavbar from "../components/SupportNavbar";

export default function TicketDetails() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await api.get("/user");
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/tickets/${id}`);
      setTicket(res.data);
    } catch (err) {
      setError("Error loading ticket");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
     fetchUser();
     fetchTicket();
  }, [id]);

  if (loading) return <p>Loading ticket...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!ticket) return <p>No ticket found</p>;

  let Navbar = AdminNavbar;
  if (user?.role === "sales") Navbar = SalesNavbar;
  else if (user?.role === "support") Navbar = SupportNavbar;

  return (
    <div style={{ backgroundColor: "#f5f6fa", minHeight: "100vh" }}>
      {user && <Navbar />}

      <div
        style={{
          maxWidth: "700px",
          margin: "30px auto",
          background: "white",
          padding: "25px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "22px",
            color: "#333",
            fontWeight: "600",
          }}
        >
          Ticket Details
        </h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "16px",
          }}
        >
          <tbody>
            <tr>
              <td style={cellTitleStyle}>ID</td>
              <td style={cellValueStyle}>{ticket.id}</td>
            </tr>

            <tr>
              <td style={cellTitleStyle}>Customer</td>
              <td style={cellValueStyle}>{ticket.customer?.name || "-"}</td>
            </tr>

            <tr>
              <td style={cellTitleStyle}>Subject</td>
              <td style={cellValueStyle}>{ticket.subject}</td>
            </tr>

            <tr>
              <td style={cellTitleStyle}>Status</td>
              <td style={cellValueStyle}>{ticket.status}</td>
            </tr>

            <tr>
              <td style={cellTitleStyle}>Priority</td>
              <td style={cellValueStyle}>{ticket.priority}</td>
            </tr>

            <tr>
              <td style={cellTitleStyle}>Assigned To</td>
              <td style={cellValueStyle}>{ticket.assigned_to?.name || "-"}</td>
            </tr>
          </tbody>
        </table>

        <div
          style={{
            marginTop: "25px",
            padding: "15px",
            background: "#fafafa",
            borderRadius: "8px",
            border: "1px solid #e6e6e6",
          }}
        >
          <h3 style={{ marginBottom: "10px", color: "#333" }}>Description</h3>
          <p style={{ lineHeight: "1.5", color: "#555" }}>
            {ticket.description || "-"}
          </p>
        </div>
      </div>
    </div>
  );
}

const cellTitleStyle = {
  fontWeight: "600",
  width: "150px",
  padding: "10px",
  background: "#f0f0f0",
  borderBottom: "1px solid #ddd",
};

const cellValueStyle = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
  color: "#444",
};
