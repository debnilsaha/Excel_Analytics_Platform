import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import ChartViewer from "../components/ChartViewer";
import Chart3DViewer from "../components/Chart3DViewer";

export default function Dashboard() {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalCharts: 0,
    totalDownloads: 0,
    totalInsights: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      navigate("/");
    } else {
      setToken(storedToken);
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const res = await axios.get("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmail(res.data.email);
      } catch {
        console.error("Failed to load user profile");
      }
    };

    const fetchRecords = async () => {
      try {
        const res = await axios.get(`/api/records?username=${username}&role=${role}`);
        setRecords(res.data);
        setFilteredRecords(res.data);
      } catch {
        alert("Failed to load records");
      }
    };

    const fetchStats = async () => {
      try {
        const res = await axios.get("/api/analytics/stats");
        setStats(res.data);
      } catch {
        console.error("Failed to load analytics stats");
      }
    };

    if (token) {
      fetchUserEmail();
      fetchRecords();
      fetchStats();
    }
  }, [username, role, token]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const term = searchTerm.toLowerCase();
      const filtered = records.filter(
        (r) =>
          r.filename.toLowerCase().includes(term) ||
          r.uploadedBy.toLowerCase().includes(term)
      );
      setFilteredRecords(filtered);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, records]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      await axios.delete(`/api/records/${id}`);
      const res = await axios.get(`/api/records?username=${username}&role=${role}`);
      setRecords(res.data);
      setFilteredRecords(res.data);
    } catch {
      alert("Delete failed");
    }
  };

  const handleDownload = (id, filename) => {
    axios({
      url: `/api/records/${id}/download`,
      method: "GET",
      responseType: "blob",
    })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
      })
      .catch(() => alert("Download failed"));
  };

  const handleChangePassword = async () => {
    if (!newPassword.trim()) return alert("Please enter a new password.");
    try {
      await axios.patch(
        "/api/auth/update-password",
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Password updated successfully.");
      setNewPassword("");
    } catch {
      alert("Failed to update password.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account?");
    if (!confirmed) return;

    try {
      await axios.delete("/api/auth/delete", {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Account deleted successfully.");
      localStorage.clear();
      navigate("/");
    } catch {
      alert("Failed to delete account.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white px-6 py-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-700">Dashboard</h1>
          </div>

          <div className="flex gap-3 items-center">
            <button
              onClick={() => setShowProfile(true)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition text-sm font-medium"
            >
              View Profile
            </button>

            <Link
              to="/upload"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm font-medium"
            >
              Upload File
            </Link>

            {role === "admin" && (
              <Link
                to="/admin"
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition text-sm font-medium"
              >
                Admin Panel
              </Link>
            )}

            <button
              onClick={() => {
                localStorage.clear();
                navigate("/");
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>


        {/* Profile Modal */}
        {showProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl relative">
              <button
                className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
                onClick={() => setShowProfile(false)}
              >
                ✕
              </button>
              <h2 className="text-xl font-bold mb-4 text-blue-700">Your Profile</h2>
              <div className="text-sm space-y-2">
                <p><strong>Username:</strong> {username}</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Role:</strong> {role}</p>
                <p><strong>Token:</strong> <code>{token?.slice(0, 30)}...</code></p>
              </div>

              <div className="mt-4">
                <label className="block text-sm mb-1 font-medium">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter new password"
                />
                <button
                  onClick={handleChangePassword}
                  className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Update Password
                </button>
              </div>

              <button
                onClick={handleDeleteAccount}
                className="mt-6 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
              >
                Delete Account
              </button>
            </div>
          </div>
        )}

        {/* Global Analytics Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-blue-100 text-blue-800 px-4 py-6 rounded-lg shadow text-center">
            <h2 className="text-3xl font-bold">{stats.totalFiles}</h2>
            <p className="text-sm font-medium mt-1">Files Uploaded</p>
          </div>
          <div className="bg-green-100 text-green-800 px-4 py-6 rounded-lg shadow text-center">
            <h2 className="text-3xl font-bold">{stats.totalCharts}</h2>
            <p className="text-sm font-medium mt-1">Charts Generated</p>
          </div>
          <div className="bg-purple-100 text-purple-800 px-4 py-6 rounded-lg shadow text-center">
            <h2 className="text-3xl font-bold">{stats.totalDownloads}</h2>
            <p className="text-sm font-medium mt-1">Downloads</p>
          </div>
          <div className="bg-yellow-100 text-yellow-800 px-4 py-6 rounded-lg shadow text-center">
            <h2 className="text-3xl font-bold">{stats.totalInsights}</h2>
            <p className="text-sm font-medium mt-1">Insights Generated</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by filename or uploader..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Records Display */}
        {filteredRecords.length === 0 ? (
          <div className="text-center text-gray-500 text-lg font-medium py-10">
            <p>No matching records found.</p>
            <Link
              to="/upload"
              className="inline-block mt-6 px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm font-medium"
            >
              Upload File
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredRecords.map((record) => (
              <div
                key={record._id}
                className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm p-6"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 break-words max-w-sm">
                      {record.filename}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Uploaded by: <strong>{record.uploadedBy}</strong> |{" "}
                      {new Date(record.uploadedAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() =>
                        setExpandedId(expandedId === record._id ? null : record._id)
                      }
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition"
                    >
                      {expandedId === record._id ? "Hide Data" : "View Data"}
                    </button>
                    <button
                      onClick={() => handleDownload(record._id, record.filename)}
                      className="px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition"
                    >
                      Download
                    </button>
                    {(record.uploadedBy === username || role === "admin") && (
                      <button
                        onClick={() => handleDelete(record._id)}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                {expandedId === record._id && record.data.length > 0 && (
                  <>
                    <div className="mt-6 flex justify-center">
                      <div className="w-full max-w-4xl">
                        <ChartViewer
                          data={record.data}
                          recordId={record._id}
                          filename={record.filename}
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex justify-center">
                      <div className="w-full max-w-4xl">
                        <Chart3DViewer data={record.data} />
                      </div>
                    </div>

                    <div className="overflow-x-auto mt-10 border rounded-md shadow-sm">
                      <table className="min-w-full text-sm bg-white">
                        <thead className="bg-gray-100 text-gray-700">
                          <tr>
                            {Object.keys(record.data[0]).map((key) => (
                              <th key={key} className="px-4 py-2 border-b text-left">
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {record.data.map((row, i) => (
                            <tr key={i} className="border-b hover:bg-gray-50 transition">
                              {Object.values(row).map((val, j) => (
                                <td key={j} className="px-4 py-2">
                                  {val}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
