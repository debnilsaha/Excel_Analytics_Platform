import React, { useState } from "react";
import Plot from "react-plotly.js";

export default function Chart3DViewer({ data }) {
  const [chartType, setChartType] = useState("3d_bar");
  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  const [xField, setXField] = useState(columns[0] || "");
  const [yField, setYField] = useState(columns[1] || "");
  const [zField, setZField] = useState(columns[2] || "");

  const numeric = (val) => (isNaN(parseFloat(val)) ? 0 : parseFloat(val));

  const createSolidBar = (x, y, zHeight, label) => {
    const width = 0.8;
    const depth = 0.8;

    const vertices = [
      [x, y, 0],
      [x + width, y, 0],
      [x + width, y + depth, 0],
      [x, y + depth, 0],
      [x, y, zHeight],
      [x + width, y, zHeight],
      [x + width, y + depth, zHeight],
      [x, y + depth, zHeight],
    ];

    const xVals = vertices.map((v) => v[0]);
    const yVals = vertices.map((v) => v[1]);
    const zVals = vertices.map((v) => v[2]);

    return {
      type: "mesh3d",
      x: xVals,
      y: yVals,
      z: zVals,
      i: [0, 0, 0, 1, 1, 2, 2, 3, 4, 4, 5, 6],
      j: [1, 2, 4, 2, 5, 3, 6, 7, 5, 6, 6, 7],
      k: [2, 3, 5, 5, 6, 6, 7, 4, 6, 7, 7, 4],
      opacity: 1,
      color: "rgb(59,130,246)",
      hovertext: `${xField}: ${label}, ${yField}: ${y}, ${zField}: ${zHeight}`,
      hoverinfo: "text",
      showscale: false,
      lighting: {
        ambient: 0.6,
        diffuse: 1,
        specular: 0.8,
        roughness: 0.4,
        fresnel: 0.2,
      },
      lightposition: {
        x: 100,
        y: 200,
        z: 100,
      },
    };
  };

  const traceData = () => {
    const x = data.map((_, i) => i);
    const y = data.map((row) => numeric(row[yField]));
    const z = data.map((row) => numeric(row[zField]));
    const labels = data.map((row) => row[xField]);

    switch (chartType) {
      case "3d_bar":
        return data.map((row, i) =>
          createSolidBar(i, 0, numeric(row[zField]), row[xField])
        );

      case "3d_line":
        return [
          {
            type: "scatter3d",
            mode: "lines+markers",
            x,
            y,
            z,
            line: { color: "#3b82f6", width: 4 },
            marker: { size: 5 },
            text: labels,
            hoverinfo: "text",
          },
        ];

      case "3d_scatter":
        return [
          {
            type: "scatter3d",
            mode: "markers",
            x,
            y,
            z,
            marker: {
              size: 5,
              color: "#10b981",
              opacity: 0.9,
            },
            text: labels,
            hoverinfo: "text",
          },
        ];

      default:
        return [];
    }
  };

  const layout = {
    scene: {
      xaxis: { title: xField || "X Axis", zeroline: false },
      yaxis: { title: yField || "Y Axis", zeroline: false },
      zaxis: { title: zField || "Z Axis", zeroline: false },
      dragmode: "turntable",
      camera: {
        projection: { type: "perspective" },
        up: { x: 1, y: 1, z: 1 },
        eye: { x: 1.6, y: 1.6, z: 1.6 },
      },
    },
    margin: { l: 0, r: 0, b: 0, t: 40 },
    height: 550,
    title: "📊 Interactive 3D Chart",
    paper_bgcolor: "white",
    plot_bgcolor: "white",
  };

  const config = {
    responsive: true,
    scrollZoom: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ["sendDataToCloud", "hoverCompareCartesian"],
    displayModeBarDefault: true,
  };

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded shadow-lg mt-6 border border-blue-100">
      <h2 className="text-2xl font-bold text-blue-600 mb-6 border-b pb-2">3D Chart Viewer</h2>

      <div className="flex gap-6 mb-6 flex-wrap">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Chart Type</label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="3d_bar">3D Bar</option>
            <option value="3d_line">3D Line</option>
            <option value="3d_scatter">3D Scatter</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">X-Axis</label>
          <select
            value={xField}
            onChange={(e) => setXField(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {columns.map((col) => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Y-Axis</label>
          <select
            value={yField}
            onChange={(e) => setYField(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {columns.map((col) => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Z-Axis</label>
          <select
            value={zField}
            onChange={(e) => setZField(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {columns.map((col) => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded border shadow overflow-hidden bg-white">
        <Plot
          data={traceData()}
          layout={layout}
          config={config}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
}
