import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      navigate("/");
    } else {
      setToken(storedToken);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Dashboard</h1>
      <p className="text-gray-600">Token: {token?.slice(0, 20)}...</p>
      <button
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/");
        }}
      >
        Logout
      </button>
    </div>
  );
}
