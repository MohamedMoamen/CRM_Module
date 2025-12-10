import { useState, useEffect } from "react";
import api from "../../api/api";
import SalesNavbar from "../../components/SalesNavbar";

export default function SalesCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add Form
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    status: "new",
  });

  // Edit Form
  const [editCustomer, setEditCustomer] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    status: "",
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const openAddModal = () => setShowAddModal(true);
  const closeAddModal = () => setShowAddModal(false);

  const openEditModal = (customer) => {
    setEditCustomer(customer);
    setEditData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      company: customer.company,
      address: customer.address,
      status: customer.status,
    });
    setShowEditModal(true);
  };
  const closeEditModal = () => setShowEditModal(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/customers");
      setCustomers(res.data);
    } catch (err) {
      setError("Error loading customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Create customer
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/newcustomer", form);
      setForm({ name: "", email: "", phone: "", company: "", address: "", status: "new" });
      closeAddModal();
      fetchCustomers();
      alert("Customer added successfully!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error adding customer");
    }
  };

  // Update customer
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/customers/${editCustomer.id}`, editData);
      closeEditModal();
      fetchCustomers();
      alert("Customer updated successfully!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error updating customer");
    }
  };

  // Delete customer
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/customers/${id}`);
      fetchCustomers();
      alert("Customer deleted successfully!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error deleting customer");
    }
  };

  const getRowStyle = (status) => {
    switch (status) {
      case "new":
        return { backgroundColor: "#FFD700" };
      case "active":
        return { backgroundColor: "#4CAF50" };
      case "vip":
        return { backgroundColor: "#FF9800" };
      default:
        return {};
    }
  };

  if (loading) return <p>Loading customers...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <SalesNavbar />

      <div style={{ display: "flex", justifyContent: "center" }}>
        <h2>Sales Customers</h2>
        <button
          style={{ marginLeft: "10px", marginTop: "15px", width: "130px", height: "40px" }}
          className="btn btn-success"
          onClick={openAddModal}
        >
          + Add Customer
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Company</th>
            <th>Address</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id} style={{ textAlign: "center", ...getRowStyle(c.status) }}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>{c.company}</td>
              <td>{c.address}</td>
              <td>{c.status}</td>
              <td>
                <button
                  style={{ backgroundColor: "#2196F3", color: "white", padding: "5px 10px", marginRight: "5px", border: "none", borderRadius: "4px" }}
                  onClick={() => openEditModal(c)}
                >
                  Edit
                </button>
                <button
                  style={{ backgroundColor: "#f44336", color: "white", padding: "5px 10px", border: "none", borderRadius: "4px" }}
                  onClick={() => handleDelete(c.id)}
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
            <h3>Add Customer</h3>
            <form onSubmit={handleCreate}>
              <label>Name:</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <label>Email:</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <label>Phone:</label>
              <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <label>Company:</label>
              <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              <label>Address:</label>
              <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              <label>Status:</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="new">New</option>
                <option value="active">Active</option>
                <option value="vip">VIP</option>
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
            <h3>Edit Customer</h3>
            <form onSubmit={handleUpdate}>
              <label>Name:</label>
              <input type="text" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} required />
              <label>Email:</label>
              <input type="email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} />
              <label>Phone:</label>
              <input type="text" value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} />
              <label>Company:</label>
              <input type="text" value={editData.company} onChange={(e) => setEditData({ ...editData, company: e.target.value })} />
              <label>Address:</label>
              <input type="text" value={editData.address} onChange={(e) => setEditData({ ...editData, address: e.target.value })} />
              <label>Status:</label>
              <select value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value })}>
                <option value="new">New</option>
                <option value="active">Active</option>
                <option value="vip">VIP</option>
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
