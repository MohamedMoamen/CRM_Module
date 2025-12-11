import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import AdminNavbar from "../../components/AdminNavbar";

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [supportUsers, setSupportUsers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    customer_id: "",
    subject: "",
    status: "open",
    priority: "medium",
    assigned_to: "",
    description: ""
  });

  const [editTicket, setEditTicket] = useState(null);
  const [editData, setEditData] = useState({
    customer_id: "",
    subject: "",
    status: "open",
    priority: "medium",
    assigned_to: "",
    description: ""
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const navigate = useNavigate();

  const openAddModal = () => setShowAddModal(true);
  const closeAddModal = () => setShowAddModal(false);

  const openEditModal = (ticket) => {
    setEditTicket(ticket);
    setEditData({
      customer_id: ticket.customer.id,
      subject: ticket.subject,
      status: ticket.status,
      priority: ticket.priority,
      assigned_to: ticket.assigned_to ? ticket.assigned_to.id : "",
      description: ticket.description || ""
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

  const fetchSupportUsers = async () => {
    try {
      const res = await api.get("/admin/support");
      setSupportUsers(res.data);
    } catch (err) {
      console.error(err);
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
    fetchSupportUsers();
    fetchCustomers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/tickets", form);
      setForm({
        customer_id: "",
        subject: "",
        status: "open",
        priority: "medium",
        assigned_to: "",
        description: ""
      });
      closeAddModal();
      fetchTickets();
      alert("Ticket added successfully!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error adding ticket");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...editData };
      await api.put(`/tickets/${editTicket.id}`, dataToSend);
      closeEditModal();
      fetchTickets();
      alert("Ticket updated successfully!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error updating ticket");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/tickets/${id}`);
      fetchTickets();
      alert("Ticket deleted successfully!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error deleting ticket");
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
        return { cursor: "pointer" };
    }
  };

  if (loading) return <p>Loading tickets...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <AdminNavbar />

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <h2>Admin Tickets</h2>
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
            <th>Assigned To</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr
              key={t.id}
              style={{ ...getRowStyle(t.status), textAlign: "center" }}
            >
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
                     padding: 0,
                     font: "inherit"
                   }}
                   onClick={() => navigate(`/ticket/${t.id}`)}
                 >
                   View Details
                 </button>
              </td>
              <td>{t.status}</td>
              <td>{t.priority}</td>
              <td>{t.assigned_to?.name || "-"}</td>
              <td>
                <button
                  style={{ backgroundColor: "#2196F3", color: "white", padding: "5px 10px", marginRight: "5px", border: "none", borderRadius: "4px" }}
                  onClick={(e) => { e.stopPropagation(); openEditModal(t); }}
                >
                  Edit
                </button>
                <button
                  style={{ backgroundColor: "#f44336", color: "white", padding: "5px 10px", border: "none", borderRadius: "4px" }}
                  onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ADD MODAL */}
      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ background: "white", padding: "20px", borderRadius: "8px", width: "400px" }}>
            <h3>Add Ticket</h3>
            <form onSubmit={handleCreate}>
              <label>Customer:</label>
              <select
                value={form.customer_id || ""}
                onChange={(e) => setForm({ ...form, customer_id: Number(e.target.value) })}
                required
              >
                <option value="">-- Select Customer --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <label>Subject:</label>
              <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />

              <label>Description:</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

              <label>Status:</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>

              <label>Priority:</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <label>Assign To:</label>
              <select
                value={form.assigned_to || ""}
                onChange={(e) => setForm({ ...form, assigned_to: e.target.value ? Number(e.target.value) : null })}
              >
                <option value="">-- Select Support User --</option>
                {supportUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>

              <div style={{ marginTop: "10px" }}>
                <button type="submit">Add</button>
                <button type="button" onClick={closeAddModal} style={{ marginLeft: "10px" }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ background: "white", padding: "20px", borderRadius: "8px", width: "400px" }}>
            <h3>Edit Ticket</h3>
            <form onSubmit={handleUpdate}>
              <label>Status:</label>
              <select value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value })}>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>

              <label>Priority:</label>
              <select value={editData.priority} onChange={(e) => setEditData({ ...editData, priority: e.target.value })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <label>Assign To:</label>
              <select
                value={editData.assigned_to || ""}
                onChange={(e) => setEditData({ ...editData, assigned_to: e.target.value === "" ? "" : Number(e.target.value) })}
              >
                <option value="">-- Select Support User --</option>
                {supportUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>

              <div style={{ marginTop: "10px" }}>
                <button type="submit">Update</button>
                <button type="button" onClick={closeEditModal} style={{ marginLeft: "10px" }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
