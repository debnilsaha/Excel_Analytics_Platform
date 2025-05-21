import { useState, useRef } from "react";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Pie, Scatter } from "react-chartjs-2";
import jsPDF from "jspdf";
import axios from "axios";

ChartJS.register(
  LineElement,
  BarElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function ChartViewer({ data, recordId, filename }) {
  const chartRef = useRef();
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  const [chartType, setChartType] = useState("line");
  const [xAxis, setXAxis] = useState(columns[0] || "");
  const [yAxis, setYAxis] = useState(columns[1] || "");
  const [status, setStatus] = useState("");
  const [insight, setInsight] = useState("");
  const [loadingInsight, setLoadingInsight] = useState(false);

  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const distinctColors = [
    "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
    "#ec4899", "#14b8a6", "#f97316", "#6366f1", "#eab308"
  ];

  const chartData = {
    labels: data.map((row) => row[xAxis]),
    datasets: [
      {
        label: `${yAxis} vs ${xAxis}`,
        data: data.map((row) =>
          chartType === "scatter"
            ? { x: row[xAxis], y: row[yAxis] }
            : row[yAxis]
        ),
        backgroundColor:
          chartType === "pie"
            ? data.map((_, i) => distinctColors[i % distinctColors.length])
            : "rgba(59,130,246,0.5)",
        borderColor: "rgb(59,130,246)",
        pointBackgroundColor: "rgb(59,130,246)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: chartType === "pie" ? "right" : "top",
        labels: {
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => ({
                text: `${label}: ${data.datasets[0].data[i]}`,
                fillStyle: data.datasets[0].backgroundColor[i],
                strokeStyle: "#fff",
                lineWidth: 1,
                hidden: false,
                index: i,
              }));
            }
            return [];
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const val = data[tooltipItem.dataIndex][yAxis];
            return `${data[tooltipItem.dataIndex][xAxis]}: ${val}`;
          },
        },
      },
    },
    ...(chartType === "scatter" && {
      scales: {
        x: { type: "linear", position: "bottom" },
        y: { beginAtZero: true },
      },
    }),
  };

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return <Bar ref={chartRef} data={chartData} options={options} />;
      case "pie":
        return <Pie ref={chartRef} data={chartData} options={options} />;
      case "scatter":
        return <Scatter ref={chartRef} data={chartData} options={options} />;
      default:
        return <Line ref={chartRef} data={chartData} options={options} />;
    }
  };

  const handleExportPNG = () => {
    const url = chartRef.current.toBase64Image();
    const link = document.createElement("a");
    link.href = url;
    link.download = "chart.png";
    link.click();
  };

  const handleExportPDF = () => {
    const url = chartRef.current.toBase64Image();
    const pdf = new jsPDF();
    pdf.addImage(url, "PNG", 10, 10, 180, 120);
    pdf.save("chart.pdf");
  };

  const handleSaveConfig = async () => {
    try {
      const payload = {
        chartType,
        xAxis,
        yAxis,
        recordId,
        filename,
        createdBy: localStorage.getItem("username"),
      };

      await axios.post("/api/charts/save", payload);
      setStatus("✅ Chart config saved successfully");
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to save chart config");
    }
  };

  const handleGenerateInsight = async () => {
    if (!data || data.length === 0) {
      setInsight("No data available to analyze.");
      return;
    }

    setLoadingInsight(true);
    setInsight("");
    setChatMessages([]);

    try {
      // Summarize data for AI prompt
      const numericValues = data
        .map((row) => parseFloat(row[yAxis]))
        .filter((val) => !isNaN(val));

      const dataSummary = {
        count: numericValues.length,
        min: Math.min(...numericValues),
        max: Math.max(...numericValues),
        avg: (numericValues.reduce((a, b) => a + b, 0) / numericValues.length).toFixed(2),
        sample: data.slice(0, 3),
      };

      const payload = {
        chartType,
        xAxisLabel: xAxis,
        yAxisLabel: yAxis,
        dataSummary,
      };

      const res = await axios.post("/api/ai/insight", payload);
      setInsight(res.data.insight);
      setChatMessages([{ role: "ai", content: res.data.insight }]);
    } catch (err) {
      console.error(err);
      setInsight("❌ Failed to generate insight");
    } finally {
      setLoadingInsight(false);
    }
  };

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;

    const newMessages = [...chatMessages, { role: "user", content: chatInput }];
    setChatMessages(newMessages);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await axios.post("/api/ai/insight/chat", {
        messages: newMessages,
      });
      setChatMessages([...newMessages, { role: "ai", content: res.data.reply }]);
    } catch (err) {
      console.error(err);
      setChatMessages([...newMessages, { role: "ai", content: "❌ Failed to get reply." }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mt-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">2D Chart Viewer</h2>

      <div className="flex gap-6 mb-6 flex-wrap">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Chart Type</label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="line">Line</option>
            <option value="bar">Bar</option>
            <option value="pie">Pie</option>
            <option value="scatter">Scatter</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">X-Axis</label>
          <select
            value={xAxis}
            onChange={(e) => setXAxis(e.target.value)}
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {columns.map((col) => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Y-Axis</label>
          <select
            value={yAxis}
            onChange={(e) => setYAxis(e.target.value)}
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {columns.map((col) => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-full h-[400px] bg-gray-50 border rounded p-4 mb-6">
        {renderChart()}
      </div>

      <div className="flex gap-3 flex-wrap mb-4">
        <button
          onClick={handleExportPNG}
          className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        >
          📤 Export PNG
        </button>
        <button
          onClick={handleExportPDF}
          className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700"
        >
          📄 Export PDF
        </button>
        <button
          onClick={handleSaveConfig}
          className="px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700"
        >
          💾 Save Config
        </button>
        <button
          onClick={handleGenerateInsight}
          className="px-4 py-2 bg-purple-600 text-white rounded shadow hover:bg-purple-700"
          disabled={loadingInsight}
        >
          {loadingInsight ? "⏳ Generating..." : "🤖 Generate AI Insight"}
        </button>
      </div>

      {status && <p className="text-sm text-gray-600 mb-4">{status}</p>}

      {insight && (
        <div className="mt-6 p-6 bg-purple-50 border border-purple-200 rounded-xl">
          <h3 className="font-semibold text-purple-700 text-lg mb-3">📌 AI Insight</h3>
          <p className="text-sm text-gray-800 whitespace-pre-line">{insight}</p>

          <div className="mt-6 border-t pt-4">
            <h4 className="font-semibold text-sm text-purple-600 mb-2">💬 Ask more about this insight</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`text-sm p-2 rounded-lg ${
                    msg.role === "user"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <strong>{msg.role === "user" ? "You" : "AI"}:</strong> {msg.content}
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask a follow-up question..."
                className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                onClick={handleChatSend}
                disabled={chatLoading}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                {chatLoading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
