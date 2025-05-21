import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/api/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchUsers();
    } catch {
      alert("Delete failed");
    }
  };

  const promoteUser = async (userId) => {
    try {
      await axios.patch(`/api/admin/promote/${userId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchUsers();
    } catch {
      alert("Promote failed");
    }
  };

  const demoteUser = async (userId) => {
    try {
      await axios.patch(`/api/admin/demote/${userId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchUsers();
    } catch {
      alert("Demote failed");
    }
  };

  useEffect(() => {
    if (role !== "admin") return;
    fetchUsers();
  }, [role]);

  if (role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        ❌ Access Denied – Admins Only
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">👤 Admin Panel</h1>
            <p className="text-gray-500 text-sm">Manage platform users and roles.</p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            ⬅ Back to Dashboard
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-600">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200">
              <thead className="bg-blue-50 text-blue-700">
                <tr>
                  <th className="px-4 py-3 border">Username</th>
                  <th className="px-4 py-3 border">Role</th>
                  <th className="px-4 py-3 border">Registered At</th>
                  <th className="px-4 py-3 border">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{user.username}</td>
                    <td className="px-4 py-2 border capitalize">{user.role}</td>
                    <td className="px-4 py-2 border">
                      {new Date(user.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 border space-x-2">
                      <button
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </button>
                      {user.role === "user" ? (
                        <button
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                          onClick={() => promoteUser(user._id)}
                        >
                          Promote to Admin
                        </button>
                      ) : (
                        <button
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
                          onClick={() => demoteUser(user._id)}
                        >
                          Demote to User
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
