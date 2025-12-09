import { useState, useEffect } from "react";
import api from "../../api/api";
import SalesNavbar from "../../components/SalesNavbar";

export default function SalesLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add Form
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    source: "",
  });

  // Edit Form
  const [editLead, setEditLead] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "",
    status: "",
  });

  // Convert Modal
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [company, setCompany] = useState("");
  const [address, setAddress] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const openAddModal = () => setShowAddModal(true);
  const closeAddModal = () => setShowAddModal(false);

  const openEditModal = (lead) => {
    setEditLead(lead);
    setEditData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      source: lead.source,
      status: lead.status,
    });
    setShowEditModal(true);
  };
  const closeEditModal = () => setShowEditModal(false);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await api.get("/leads");
      setLeads(res.data);
    } catch (err) {
      setError("Error loading leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Add Lead
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/leads", form);
      setForm({ name: "", email: "", phone: "", source: "" });
      closeAddModal();
      fetchLeads();
      alert("Lead added successfully!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error adding lead");
    }
  };

  // Update Lead
  const handleUpdate = async (e) => {
  e.preventDefault();
  try {
    await api.put(`/leads/${editLead.id}`, editData);

    if (editData.status === "converted") {
      setShowConvertModal(true);
    } else {
      closeEditModal();
      fetchLeads();
      alert("Lead updated successfully!");
    }
  } catch (err) {
    console.error(err.response?.data || err.message);
    alert("Error updating lead");
  }
};

  // Convert Lead to Customer
 const handleConvert = async () => {
  try {
    await api.post("/customer", {
      lead_id: editLead.id,
      company,
      address,
    });

    setShowConvertModal(false);
    closeEditModal();
    fetchLeads();
    setCompany("");
    setAddress("");
    alert("Lead converted & customer created!");
  } catch (err) {
    console.error(err.response?.data || err.message);
    alert("Error converting lead");
  }
};

  // Delete Lead
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/leads/${id}`);
      fetchLeads();
      alert("Lead deleted successfully!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error deleting lead");
    }
  };

  const getRowStyle = (status) => {
    switch (status) {
      case "new":
        return { backgroundColor: "#FFD700" };
      case "contacted":
        return { backgroundColor: "#FF9800" };
      case "converted":
        return { backgroundColor: "#4CAF50" };
      default:
        return {};
    }
  };

  if (loading) return <p>Loading leads...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <SalesNavbar />

      <div style={{ display: "flex", justifyContent: "center" }}>
        <h2>Sales Leads</h2>
        <button
          style={{ marginLeft: "10px", marginTop: "15px", width: "100px", height: "40px" }}
          className="btn btn-success"
          onClick={openAddModal}
        >
          + Add Lead
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Source</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} style={{ textAlign: "center", ...getRowStyle(lead.status) }}>
              <td>{lead.id}</td>
              <td>{lead.name}</td>
              <td>{lead.email}</td>
              <td>{lead.phone}</td>
              <td>{lead.source}</td>
              <td>{lead.status}</td>
              <td>
                <button
                  style={{
                    backgroundColor: "#2196F3",
                    color: "white",
                    padding: "5px 10px",
                    marginRight: "5px",
                    border: "none",
                    borderRadius: "4px",
                  }}
                  onClick={() => openEditModal(lead)}
                >
                  Edit
                </button>
                <button
                  style={{
                    backgroundColor: "#f44336",
                    color: "white",
                    padding: "5px 10px",
                    border: "none",
                    borderRadius: "4px",
                  }}
                  onClick={() => handleDelete(lead.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Modal */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ background: "white", padding: "20px", borderRadius: "8px", width: "400px" }}>
            <h3>Add Lead</h3>
            <form onSubmit={handleCreate}>
              <label>Name:</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <label>Email:</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <label>Phone:</label>
              <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <label>Source:</label>
              <input type="text" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
              <div style={{ marginTop: "10px" }}>
                <button type="submit">Add</button>
                <button type="button" onClick={closeAddModal} style={{ marginLeft: "10px" }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ background: "white", padding: "20px", borderRadius: "8px", width: "400px" }}>
            <h3>Edit Lead</h3>
            <form onSubmit={handleUpdate}>
              <label>Name:</label>
              <input type="text" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} required />
              <label>Email:</label>
              <input type="email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} />
              <label>Phone:</label>
              <input type="text" value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} />
              <label>Source:</label>
              <input type="text" value={editData.source} onChange={(e) => setEditData({ ...editData, source: e.target.value })} />
              <label>Status:</label>
              <select value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value })}>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
              </select>
              <div style={{ marginTop: "10px" }}>
                <button type="submit">Save</button>
                <button type="button" onClick={closeEditModal} style={{ marginLeft: "10px" }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Convert Modal */}
      {showConvertModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ background: "white", padding: "20px", borderRadius: "8px", width: "400px" }}>
            <h3>Convert Lead → Customer</h3>
            <label>Company:</label>
            <input value={company} onChange={(e) => setCompany(e.target.value)} />
            <label>Address:</label>
            <input value={address} onChange={(e) => setAddress(e.target.value)} />
            <div style={{ marginTop: "10px" }}>
              <button onClick={handleConvert}>Confirm</button>
              <button type="button" onClick={() => setShowConvertModal(false)} style={{ marginLeft: "10px" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
