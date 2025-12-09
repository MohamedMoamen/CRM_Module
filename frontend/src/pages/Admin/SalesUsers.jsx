
import { useState, useEffect } from "react";
import api from "../../api/api";
import AdminNavbar from "../../components/AdminNavbar";

export default function SalesUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ADD FORM
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    });

    // EDIT FORM
    const [editUser, setEditUser] = useState(null);
    const [editData, setEditData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    });

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const openAddModal = () => setShowAddModal(true);
    const closeAddModal = () => setShowAddModal(false);

    const openEditModal = (user) => {
        setEditUser(user);
        setEditData({
            name: user.name,
            email: user.email,
            phone: user.phone,
            password: "",
        });
        setShowEditModal(true);
    };
    const closeEditModal = () => setShowEditModal(false);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get("/admin/sales");
            setUsers(res.data);
        } catch (err) {
            setError("Error loading users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        await api.post("/admin/sales", form);
        setForm({ name: "", email: "", phone: "", password: "" });
        closeAddModal();
        fetchUsers();
        alert("Sales user added successfully!");
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
         const dataToSend = {};
        if (editData.name) dataToSend.name = editData.name;
        if (editData.email) dataToSend.email = editData.email;
        if (editData.phone) dataToSend.phone = editData.phone;
        if (editData.password) dataToSend.password = editData.password;
        try {
        await api.put(`/admin/sales/${editUser.id}`, dataToSend);
        closeEditModal();
        fetchUsers();
        alert("Sales user updated successfully!");
        } catch (err) {
        console.error(err.response?.data || err.message);
        alert(
            "Error updating user: " +
            (err.response?.data?.message || JSON.stringify(err.response?.data))
        );
      }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure?");
        if (!confirmDelete) return;
        await api.delete(`/admin/sales/${id}`);
        fetchUsers();
        alert("Sales user deleted successfully!");
    };

    if (loading) return <p>Loading users...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <AdminNavbar />

            <div style={{ display: "flex", justifyContent: "center" }}>
                <h2>Sales Users</h2>
                <button
                    style={{ marginLeft: "10px", marginTop: "15px", width: "100px", height: "40px" }}
                    className="btn btn-success"
                    onClick={openAddModal}
                >
                    + Add User
                </button>
            </div>

           
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ backgroundColor: "#f2f2f2" }}>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th> 
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} style={{ textAlign: "center" }}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td> 
                            <td>
                                <button
                                    style={{
                                        backgroundColor: "#4CAF50",
                                        color: "white",
                                        padding: "5px 10px",
                                        marginRight: "5px",
                                        border: "none",
                                        borderRadius: "4px",
                                    }}
                                    onClick={() => openEditModal(user)}
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
                                    onClick={() => handleDelete(user.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            
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
                        <h3>Add Sales User</h3>
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
                                required
                            />

                            <label>Phone:</label> 
                            <input
                                type="text"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                required
                            />

                            <label>Password:</label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                            />

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
                        <h3>Edit User</h3>
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
                                required
                            />

                            <label>Phone:</label> 
                            <input
                                type="text"
                                value={editData.phone}
                                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                required
                            />

                            <label>Password (optional):</label>
                            <input
                                type="password"
                                placeholder="Enter new password if needed"
                                value={editData.password}
                                onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                            />

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

