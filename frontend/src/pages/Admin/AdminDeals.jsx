import { useState, useEffect } from "react";
import api from "../../api/api";
import AdminNavbar from "../../components/AdminNavbar";

export default function AdminDeals() {
  const [deals, setDeals] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [salesUsers, setSalesUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add Form
  const [form, setForm] = useState({
    customer_id: "",
    amount: "",
    stage: "new",
    expected_close_date: "",
  });

  // Edit Form
  const [editDeal, setEditDeal] = useState(null);
  const [editData, setEditData] = useState({
    customer_id: "",
    amount: "",
    stage: "",
    expected_close_date: "",
    assigned_to: "",
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const openAddModal = () => setShowAddModal(true);
  const closeAddModal = () => setShowAddModal(false);

  const openEditModal = (deal) => {
    setEditDeal(deal);
    setEditData({
      customer_id: deal.customer_id,
      amount: deal.amount,
      stage: deal.stage,
      expected_close_date: deal.expected_close_date,
      assigned_to: deal.customer.assigned_to,
    });
    setShowEditModal(true);
  };
  const closeEditModal = () => setShowEditModal(false);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/deals");
      setDeals(res.data);
    } catch (err) {
      setError("Error loading deals");
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

  const fetchSalesUsers = async () => {
    try {
      const res = await api.get("/admin/sales");
      setSalesUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDeals();
    fetchCustomers();
    fetchSalesUsers();
  }, []);

  // Create deal
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/deals", form);
      setForm({ customer_id: "", amount: "", stage: "new", expected_close_date: "" });
      closeAddModal();
      fetchDeals();
      alert("Deal added successfully!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error adding deal");
    }
  };

  // Update deal
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...editData };
      await api.put(`/admin/deals/${editDeal.id}`, dataToSend);
      closeEditModal();
      fetchDeals();
      alert("Deal updated successfully!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error updating deal");
    }
  };

  // Delete deal
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/admin/deals/${id}`);
      fetchDeals();
      alert("Deal deleted successfully!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error deleting deal");
    }
  };

  const getRowStyle = (stage) => {
    switch (stage) {
      case "new":
        return { backgroundColor: "#FFD700" };
      case "negotiation":
        return { backgroundColor: "#2196F3", color: "white" };
      case "won":
        return { backgroundColor: "#4CAF50", color: "white" };
      case "lost":
        return { backgroundColor: "#f44336", color: "white" };
      default:
        return {};
    }
  };

  if (loading) return <p>Loading deals...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <AdminNavbar />

      <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
        <h2>Admin Deals</h2>
        <button
          style={{ marginTop:"15px",marginLeft: "10px", width: "130px", height: "40px" }}
          className="btn btn-success"
          onClick={openAddModal}
        >
          + Add Deal
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th>ID</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Stage</th>
            <th>Expected Close Date</th>
            <th>Assigned To</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {deals.map((d) => (
            <tr key={d.id} style={{ textAlign: "center", ...getRowStyle(d.stage) }}>
              <td>{d.id}</td>
              <td>{d.customer?.name || "-"}</td>
              <td>{d.amount}</td>
              <td>{d.stage}</td>
              <td>{d.expected_close_date || "-"}</td>
              <td>{salesUsers.find(u => u.id === d.customer?.assigned_to)?.name || "-"}</td>
              <td>
                <button
                  style={{ backgroundColor: "#2196F3", color: "white", padding: "5px 10px", marginRight: "5px", border: "none", borderRadius: "4px" }}
                  onClick={() => openEditModal(d)}
                >
                  Edit
                </button>
                <button
                  style={{ backgroundColor: "#f44336", color: "white", padding: "5px 10px", border: "none", borderRadius: "4px" }}
                  onClick={() => handleDelete(d.id)}
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
            <h3>Add Deal</h3>
            <form onSubmit={handleCreate}>
              <label>Customer:</label>
              <select
                value={form.customer_id}
                onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
                required
              >
                <option value="">-- Select Customer --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <label>Amount:</label>
              <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />

              <label>Stage:</label>
              <select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })}>
                <option value="new">New</option>
                <option value="negotiation">Negotiation</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>

              <label>Expected Close Date:</label>
              <input type="date" value={form.expected_close_date} onChange={(e) => setForm({ ...form, expected_close_date: e.target.value })} />


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
            <h3>Edit Deal</h3>
            <form onSubmit={handleUpdate}>
              <label>Customer:</label>
              <select
                value={editData.customer_id}
                onChange={(e) => setEditData({ ...editData, customer_id: e.target.value })}
                required
              >
                <option value="">-- Select Customer --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <label>Amount:</label>
              <input type="number" value={editData.amount} onChange={(e) => setEditData({ ...editData, amount: e.target.value })} required />

              <label>Stage:</label>
              <select value={editData.stage} onChange={(e) => setEditData({ ...editData, stage: e.target.value })}>
                <option value="new">New</option>
                <option value="negotiation">Negotiation</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>

              <label>Expected Close Date:</label>
              <input type="date" value={editData.expected_close_date} onChange={(e) => setEditData({ ...editData, expected_close_date: e.target.value })} />

              <label>Assigned To:</label>
              <select
                value={editData.assigned_to || ""}
                onChange={(e) => setEditData({ ...editData, assigned_to: e.target.value ? Number(e.target.value) : "" })}
              >
                <option value="">-- Select Sales User --</option>
                {salesUsers.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
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
