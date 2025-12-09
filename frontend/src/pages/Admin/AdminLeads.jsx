import { useState, useEffect } from "react";
import api from "../../api/api";
import AdminNavbar from "../../components/AdminNavbar";

export default function AdminLeads() {
    const [leads, setLeads] = useState([]);
    const [salesUsers, setSalesUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ADD FORM
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        source: "",
        assigned_to: "",
    });

    // EDIT FORM
    const [editLead, setEditLead] = useState(null);
    const [editData, setEditData] = useState({
        name: "",
        email: "",
        phone: "",
        source: "",
        status: "",
        assigned_to: "",
    });

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
            assigned_to: lead.assigned_to || "",
        });
        setShowEditModal(true);
    };
    const closeEditModal = () => setShowEditModal(false);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const res = await api.get("/admin/leads");
            setLeads(res.data);
        } catch (err) {
            setError("Error loading leads");
        } finally {
            setLoading(false);
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
        fetchLeads();
        fetchSalesUsers();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        await api.post("/admin/leads", form);
        setForm({ name: "", email: "", phone: "", source: "", assigned_to: "" });
        closeAddModal();
        fetchLeads();
        alert("Lead added successfully!");
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const dataToSend = { ...editData };
        try {
            await api.put(`/admin/leads/${editLead.id}`, dataToSend);
            closeEditModal();
            fetchLeads();
            alert("Lead updated successfully!");
        } catch (err) {
            console.error(err.response?.data || err.message);
            alert("Error updating lead");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        await api.delete(`/admin/leads/${id}`);
        fetchLeads();
        alert("Lead deleted successfully!");
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
            <AdminNavbar />

            <div style={{ display: "flex", justifyContent: "center" }}>
                <h2>Admin Leads</h2>
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
                        <th>Assigned To</th>
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
                            <td>{lead.assigned_to_name || "-"}</td>
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

            {/* ADD MODAL */}
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
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                            <label>Email:</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                            <label>Phone:</label>
                            <input
                                type="text"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            />
                            <label>Source:</label>
                            <input
                                type="text"
                                value={form.source}
                                onChange={(e) => setForm({ ...form, source: e.target.value })}
                            />
                            <label>Assign To:</label>
                            <select
                                value={form.assigned_to}
                                onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
                            >
                                <option value="">-- Select Sales User --</option>
                                {salesUsers.map((user) => (
                                    <option key={user.id} value={user.id}>{user.name}</option>
                                ))}
                            </select>
                            <div style={{ marginTop: "10px" }}>
                                <button type="submit">Add</button>
                                <button type="button" onClick={closeAddModal}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT MODAL */}
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
                            <input
                                type="text"
                                value={editData.name}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                required
                            />
                            <label>Email:</label>
                            <input
                                type="email"
                                value={editData.email}
                                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                            />
                            <label>Phone:</label>
                            <input
                                type="text"
                                value={editData.phone}
                                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                            />
                            <label>Source:</label>
                            <input
                                type="text"
                                value={editData.source}
                                onChange={(e) => setEditData({ ...editData, source: e.target.value })}
                            />
                            <label>Assign To:</label>
                            <select
                                value={editData.assigned_to}
                                onChange={(e) => setEditData({ ...editData, assigned_to: e.target.value })}
                            >
                                <option value="">-- Select Sales User --</option>
                                {salesUsers.map((user) => (
                                    <option key={user.id} value={user.id}>{user.name}</option>
                                ))}
                            </select>
                            <div style={{ marginTop: "10px" }}>
                                <button type="submit">Update</button>
                                <button type="button" onClick={closeEditModal}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
