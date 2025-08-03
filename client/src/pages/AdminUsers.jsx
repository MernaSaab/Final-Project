import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AdminNavbar from "../components/AdminNavbar";
import LoadingSpinner from "../components/LoadingSpinner";
import "./AdminUsers.css";

const EditUserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    email: user.email || "",
    phone: user.phone || "",
    address: user.address || "",
  });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await onSave(user.user_id, formData);
    } catch (err) {
      setError(err.message || "שגיאה בשמירת המשתמש");
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>עריכת משתמש</h3>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        {error && <div className="modal-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="first_name">שם פרטי</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="last_name">שם משפחה</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">אימייל</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">טלפון</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">כתובת</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={saving}
            >
              ביטול
            </button>
            <button type="submit" className="save-button" disabled={saving}>
              {saving ? "שומר..." : "שמור שינויים"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const { logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin()) {
      navigate("/");
      return;
    }

    const fetchUsers = async () => {
      // Get authentication token
      const token = sessionStorage.getItem("auth_token");
      if (!token) {
        setError("נדרשת התחברות מחדש");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:3001/users", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            logout();
            navigate("/login");
            return;
          }
          throw new Error(`שגיאה בטעינת נתוני משתמשים: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.message || "שגיאה בטעינת נתוני משתמשים");
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAdmin, logout, navigate]);

  const handleEditUser = (user) => {
    setEditingUser({ ...user });
  };

  const handleCloseModal = () => {
    setEditingUser(null);
  };

  const handleDeleteConfirm = (userId) => {
    setConfirmDelete(userId);
  };

  const handleDeleteCancel = () => {
    setConfirmDelete(null);
  };

  const handleSaveUser = async (userId, updatedData) => {
    try {
      const token = sessionStorage.getItem("auth_token");
      if (!token) {
        throw new Error("אין הרשאת גישה");
      }

      // Extract only the fields that the backend expects
      const { first_name, last_name, email, phone } = updatedData;
      const dataToSend = {
        first_name,
        last_name,
        email,
        phone,
        address: updatedData.address || "", // Provide a default empty string if address is not present
      };

      // Extract the numeric ID from the user_id (remove any non-numeric prefix like 'u')
      const numericId = userId.replace(/\D/g, "");

      const response = await fetch(`http://localhost:3001/users/${numericId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response:", errorText);
        throw new Error("שגיאה בעדכון המשתמש");
      }

      const responseData = await response.json();

      // Update the users list with the updated user data
      setUsers(
        users.map((user) =>
          user.user_id === userId
            ? {
                ...user,
                first_name: dataToSend.first_name,
                last_name: dataToSend.last_name,
                email: dataToSend.email,
                phone: dataToSend.phone,
                address: dataToSend.address,
              }
            : user
        )
      );

      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
      setError(error.message || "שגיאה בעדכון המשתמש");
    }
  };

  const handleDelete = async (userId) => {
    // Get authentication token
    const token = sessionStorage.getItem("auth_token");
    if (!token) {
      setError("נדרשת התחברות מחדש");
      return;
    }

    try {
      // Extract the numeric ID from the user_id (remove any non-numeric prefix like 'u')
      const numericId = userId.replace(/\D/g, "");

      // First, get all orders for this user
      const ordersResponse = await fetch(`http://localhost:3001/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (ordersResponse.ok) {
        const orders = await ordersResponse.json();
        const userOrders = orders.filter(
          (order) => order.user_id === `u${numericId}`
        );

        // Delete related order_meal entries and then orders for this user
        for (const order of userOrders) {
          // First delete order_meal entries
          await fetch(`http://localhost:3001/order_meal/${order.order_id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          // Then delete the order
          await fetch(`http://localhost:3001/orders/${order.order_id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
        }
      }

      // Now delete the user
      const response = await fetch(`http://localhost:3001/users/${numericId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response:", errorText);

        if (response.status === 401 || response.status === 403) {
          logout();
          navigate("/login");
          return;
        }
        throw new Error(`שגיאה במחיקת משתמש: ${response.status}`);
      }

      // Update users list after successful deletion
      setUsers(users.filter((user) => user.user_id !== userId));
      setConfirmDelete(null);
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(err.message || "שגיאה במחיקת משתמש");
    }
  };

  return (
    <div className="admin-users-container">
      <AdminNavbar />

      <main>
        <h2>רשימת משתמשים רשומים</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="search-box">
          <input
            type="text"
            id="searchInput"
            className="search-input"
            placeholder="חפש לפי שם, אימייל או טלפון..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="loading-container">
            <LoadingSpinner message="טוען משתמשים..." />
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>מס'</th>
                  <th>שם פרטי</th>
                  <th>שם משפחה</th>
                  <th>אימייל</th>
                  <th>טלפון</th>
                  <th>גיל</th>
                  <th>סטטוס</th>
                  <th>פעולה</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.user_id}>
                      <td>{user.user_id}</td>
                      <td>{user.first_name}</td>
                      <td>{user.last_name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.age || "-"}</td>
                      <td>{user.status || "פעיל"}</td>
                      <td className="action-buttons">
                        <button
                          className="btn-update"
                          onClick={() => handleEditUser(user)}
                        >
                          עדכן
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteConfirm(user.user_id)}
                        >
                          מחק
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="no-results">
                      לא נמצאו משתמשים
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <footer className="admin-footer">
        <p>מערכת ניהול </p>
      </footer>

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={handleCloseModal}
          onSave={handleSaveUser}
        />
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal-content delete-confirm">
            <div className="modal-header">
              <h3>אישור מחיקה</h3>
              <button className="close-button" onClick={handleDeleteCancel}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>האם אתה בטוח שברצונך למחוק את המשתמש הזה?</p>
              <p className="warning">פעולה זו אינה הפיכה!</p>
            </div>
            <div className="modal-actions">
              <button className="cancel-button" onClick={handleDeleteCancel}>
                ביטול
              </button>
              <button
                className="delete-button"
                onClick={() => handleDelete(confirmDelete)}
              >
                מחק משתמש
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
