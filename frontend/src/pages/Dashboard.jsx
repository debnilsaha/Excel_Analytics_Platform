import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import ChartViewer from "../components/ChartViewer";
import Chart3DViewer from "../components/Chart3DViewer";

export default function Dashboard() {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [records, setRecords] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

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
    const fetchRecords = async () => {
      try {
        const res = await axios.get(`/api/records?username=${username}&role=${role}`);
        setRecords(res.data);
      } catch {
        alert("Failed to load records");
      }
    };

    fetchRecords();
  }, [username, role]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      await axios.delete(`/api/records/${id}`);
      const res = await axios.get(`/api/records?username=${username}&role=${role}`);
      setRecords(res.data);
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

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white px-6 py-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-700">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Logged in as:{" "}
              <span className="font-semibold capitalize text-gray-800">{role}</span>
            </p>
          </div>

          <div className="flex gap-3 items-center">
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

        <div className="text-sm text-gray-400 mb-6">
          Access Token:{" "}
          <code className="text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {token?.slice(0, 20)}...
          </code>
        </div>

        {records.length === 0 ? (
          <div className="text-center text-gray-500 text-lg font-medium py-10">
            <p>No records uploaded yet.</p>
            <Link
              to="/upload"
              className="inline-block mt-6 px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm font-medium"
            >
              Upload File
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {records.map((record) => (
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
                    {/* 2D Chart */}
                    <div className="mt-6 flex justify-center">
                      <div className="w-full max-w-4xl">
                        <ChartViewer
                          data={record.data}
                          recordId={record._id}
                          filename={record.filename}
                        />
                      </div>
                    </div>

                    {/* 3D Chart */}
                    <div className="mt-8 flex justify-center">
                      <div className="w-full max-w-4xl">
                        <Chart3DViewer data={record.data} />
                      </div>
                    </div>

                    {/* Table */}
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
