import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) return alert("Please select a file.");

    const username = localStorage.getItem("username");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("username", username);

    try {
      const res = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">📤 Upload Excel File</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Choose .xlsx or .xls file</label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>

        <button
          onClick={handleUpload}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm font-medium transition"
        >
          Upload File
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded text-sm font-medium transition"
        >
          ← Back to Dashboard
        </button>

        {message && (
          <div className="mt-4 text-center text-sm font-medium text-green-600">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
