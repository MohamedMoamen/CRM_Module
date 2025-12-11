import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import SupportNavbar from "../../components/SupportNavbar";

export default function SupportTickets() {
  const [tickets, setTickets] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    customer_id: "",
    subject: "",
    description: "",
    priority: "medium",
  });

  const [editTicket, setEditTicket] = useState(null);
  const [editData, setEditData] = useState({
    status: "open",
    priority: "medium",
    description: "",
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const navigate = useNavigate();

  const openAddModal = () => setShowAddModal(true);
  const closeAddModal = () => setShowAddModal(false);

  const openEditModal = (ticket) => {
    setEditTicket(ticket);
    setEditData({
      status: ticket.status,
      priority: ticket.priority,
      description: ticket.description || "",
    });
    setShowEditModal(true);
  };
  const closeEditModal = () => setShowEditModal(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tickets");
      setTickets(res.data);
    } catch (err) {
      setError("Error loading tickets");
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchCustomers();
  }, []);

  // Create Ticket 
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/tickets", form);
      setForm({
        customer_id: "",
        subject: "",
        description: "",
        priority: "medium",
      });
      closeAddModal();
      fetchTickets();
      alert("Ticket created successfully!");
    } catch (err) {
      alert("Error creating ticket");
      console.error(err);
    }
  };

  // Update Ticket (Support)
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/tickets/${editTicket.id}`, editData);
      closeEditModal();
      fetchTickets();
      alert("Ticket updated successfully!");
    } catch (err) {
      alert("Error updating ticket");
      console.error(err);
    }
  };

  const getRowStyle = (status) => {
    switch (status) {
      case "open":
        return { backgroundColor: "#FFD700" };
      case "in_progress":
        return { backgroundColor: "#FF9800" };
      case "closed":
        return { backgroundColor: "#4CAF50" };
      default:
        return {};
    }
  };

  if (loading) return <p>Loading tickets...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <SupportNavbar />

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <h2>My Tickets</h2>

        <button
          style={{ marginLeft: "10px", marginTop: "15px", width: "130px", height: "40px" }}
          className="btn btn-success"
          onClick={openAddModal}
        >
          + Add Ticket
        </button>
      </div>

      
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>
            <th>ID</th>
            <th>Customer</th>
            <th>Subject</th>
            <th>Description</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {tickets.map((t) => (
            <tr key={t.id} style={{ ...getRowStyle(t.status), textAlign: "center" }}>
              <td>{t.id}</td>
              <td>{t.customer?.name || "-"}</td>
              <td>{t.subject}</td>

              <td>
                <button
                  style={{
                    color: "black",
                    background: "gray",
                    border: "solid 1px black",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/ticket/${t.id}`)}
                >
                  View Details
                </button>
              </td>

              <td>{t.status}</td>
              <td>{t.priority}</td>

              <td>
                <button
                  style={{
                    backgroundColor: "#2196F3",
                    color: "white",
                    padding: "5px 10px",
                    border: "none",
                    borderRadius: "4px",
                  }}
                  onClick={() => openEditModal(t)}
                >
                  Edit
                </button>
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ADD MODAL */}
      {showAddModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3>Add Ticket</h3>
            <form onSubmit={handleCreate}>
              <label>Customer:</label>
              <select
                value={form.customer_id}
                onChange={(e) => setForm({ ...form, customer_id: Number(e.target.value) })}
                required
              >
                <option value="">-- Select Customer --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <label>Subject:</label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
              />

              <label>Description:</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              
              <label>Status:</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>

              <label>Priority:</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <div style={{ marginTop: "10px" }}>
                <button type="submit">Add</button>
                <button type="button" onClick={closeAddModal} style={{ marginLeft: "10px" }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3>Edit Ticket</h3>

            <form onSubmit={handleUpdate}>
              <label>Status:</label>
              <select
                value={editData.status}
                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>

              <label>Priority:</label>
              <select
                value={editData.priority}
                onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <div style={{ marginTop: "10px" }}>
                <button type="submit">Update</button>
                <button type="button" onClick={closeEditModal} style={{ marginLeft: "10px" }}>
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const modalOverlay = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalBox = {
  background: "white",
  padding: "20px",
  borderRadius: "8px",
  width: "400px",
};
