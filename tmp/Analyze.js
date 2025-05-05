import React, { useState } from "react";
import axios from "axios";
import Plot from "react-plotly.js";

const Analyze = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await axios.post("http://127.0.0.1:8008/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setAnalysis(res.data);
    } catch (err) {
      alert("Error uploading file: " + err);
    }
  };

  return (
    <div className="container">
      <h1>Analyze Your Data</h1>
      <div style={{ marginBottom: "1rem" }}>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload CSV</button>
      </div>

      {analysis && (
        <div>
          {/* Sales Over Time Chart */}
          {analysis.charts.sales_over_time.dates && (
            <div>
              <h2>Sales Over Time</h2>
              <Plot
                data={[
                  {
                    x: analysis.charts.sales_over_time.dates,
                    y: analysis.charts.sales_over_time.sales,
                    type: "scatter",
                    mode: "lines+markers",
                    marker: { color: "cyan" }
                  }
                ]}
                layout={{
                  title: "Sales Over Time",
                  paper_bgcolor: "#121212",
                  plot_bgcolor: "#121212",
                  font: { color: "#f0f0f0" },
                  xaxis: { title: "Date" },
                  yaxis: { title: "Sales" }
                }}
              />
            </div>
          )}

          {/* Sales by Product Chart */}
          {analysis.charts.sales_by_product.products && (
            <div>
              <h2>Sales by Product</h2>
              <Plot
                data={[
                  {
                    x: analysis.charts.sales_by_product.products,
                    y: analysis.charts.sales_by_product.sales,
                    type: "bar",
                    marker: { color: "orange" }
                  }
                ]}
                layout={{
                  title: "Sales by Product",
                  paper_bgcolor: "#121212",
                  plot_bgcolor: "#121212",
                  font: { color: "#f0f0f0" },
                  xaxis: { title: "Product" },
                  yaxis: { title: "Total Sales" }
                }}
              />
            </div>
          )}

          {/* Category vs Region Chart */}
          {analysis.charts.category_region.categories && (
            <div>
              <h2>Sales by Category & Region</h2>
              <Plot
                data={analysis.charts.category_region.series.map((regionData) => ({
                  x: analysis.charts.category_region.categories,
                  y: regionData.sales,
                  type: "bar",
                  name: regionData.region
                }))}
                layout={{
                  title: "Category vs Region",
                  barmode: "stack",
                  paper_bgcolor: "#121212",
                  plot_bgcolor: "#121212",
                  font: { color: "#f0f0f0" },
                  xaxis: { title: "Category" },
                  yaxis: { title: "Sales" }
                }}
              />
            </div>
          )}

          {/* Pie Chart for Sales Share */}
          {analysis.charts.sales_share.labels && (
            <div>
              <h2>Share of Sales by Category</h2>
              <Plot
                data={[
                  {
                    labels: analysis.charts.sales_share.labels,
                    values: analysis.charts.sales_share.values,
                    type: "pie",
                    hole: 0.4
                  }
                ]}
                layout={{
                  title: "Sales Share by Category",
                  paper_bgcolor: "#121212",
                  plot_bgcolor: "#121212",
                  font: { color: "#f0f0f0" }
                }}
              />
            </div>
          )}

          {/* Scatter Plot: Sales vs Inventory */}
          {analysis.charts.sales_vs_inventory.sales && (
            <div>
              <h2>Sales vs Inventory</h2>
              <Plot
                data={[
                  {
                    x: analysis.charts.sales_vs_inventory.inventory,
                    y: analysis.charts.sales_vs_inventory.sales,
                    mode: "markers",
                    type: "scatter",
                    marker: { color: "lightblue" }
                  }
                ]}
                layout={{
                  title: "Sales vs Inventory",
                  paper_bgcolor: "#121212",
                  plot_bgcolor: "#121212",
                  font: { color: "#f0f0f0" },
                  xaxis: { title: "Inventory Quantity" },
                  yaxis: { title: "Sales" }
                }}
              />
            </div>
          )}

          {/* Combo Chart: Sales & Inventory Over Time */}
          {analysis.charts.sales_inventory_combo.dates && (
            <div>
              <h2>Sales & Inventory Over Time</h2>
              <Plot
                data={[
                  {
                    x: analysis.charts.sales_inventory_combo.dates,
                    y: analysis.charts.sales_inventory_combo.sales,
                    type: "scatter",
                    mode: "lines",
                    name: "Sales",
                    yaxis: "y1",
                    marker: { color: "cyan" }
                  },
                  {
                    x: analysis.charts.sales_inventory_combo.dates,
                    y: analysis.charts.sales_inventory_combo.inventory,
                    type: "scatter",
                    mode: "lines",
                    name: "Inventory",
                    yaxis: "y2",
                    marker: { color: "yellow" }
                  }
                ]}
                layout={{
                  title: "Sales & Inventory Over Time",
                  paper_bgcolor: "#121212",
                  plot_bgcolor: "#121212",
                  font: { color: "#f0f0f0" },
                  xaxis: { title: "Date" },
                  yaxis: { title: "Sales", side: "left" },
                  yaxis2: { title: "Inventory", overlaying: "y", side: "right" }
                }}
              />
            </div>
          )}

          {/* Heat Map: Category vs Region */}
          {analysis.charts.category_region_heatmap.categories && (
            <div>
              <h2>Heat Map: Category vs Region</h2>
              <Plot
                data={[
                  {
                    x: analysis.charts.category_region_heatmap.regions,
                    y: analysis.charts.category_region_heatmap.categories,
                    z: analysis.charts.category_region_heatmap.matrix,
                    type: "heatmap",
                    colorscale: "Viridis"
                  }
                ]}
                layout={{
                  title: "Category vs Region Heatmap",
                  paper_bgcolor: "#121212",
                  plot_bgcolor: "#121212",
                  font: { color: "#f0f0f0" },
                  xaxis: { title: "Region" },
                  yaxis: { title: "Category" }
                }}
              />
            </div>
          )}

          {/* Waterfall Chart */}
          {analysis.charts.sales_waterfall.quarters && (
            <div>
              <h2>Quarterly Sales Changes</h2>
              <Plot
                data={[
                  {
                    type: "waterfall",
                    x: analysis.charts.sales_waterfall.quarters,
                    y: analysis.charts.sales_waterfall.values,
                    measure: Array(analysis.charts.sales_waterfall.values.length).fill("relative"),
                    connector: { line: { color: "gray" } }
                  }
                ]}
                layout={{
                  title: "Quarterly Sales Changes",
                  paper_bgcolor: "#121212",
                  plot_bgcolor: "#121212",
                  font: { color: "#f0f0f0" },
                  xaxis: { title: "Quarter" },
                  yaxis: { title: "Sales" }
                }}
              />
            </div>
          )}

          {/* Treemap */}
          {analysis.charts.sales_treemap.labels && (
            <div>
              <h2>Sales Treemap</h2>
              <Plot
                data={[
                  {
                    type: "treemap",
                    labels: analysis.charts.sales_treemap.labels,
                    parents: analysis.charts.sales_treemap.parents,
                    values: analysis.charts.sales_treemap.values,
                    textinfo: "label+value+percent parent"
                  }
                ]}
                layout={{
                  title: "Sales Treemap",
                  paper_bgcolor: "#121212",
                  font: { color: "#f0f0f0" }
                }}
              />
            </div>
          )}

          {/* Insights & Recommendations */}
          {analysis.insights && (
            <div className="card">
              <h2>Insights & Recommendations</h2>
              <ul>
                {analysis.insights.best_seller && <li>{analysis.insights.best_seller}</li>}
                {analysis.insights.low_category && <li>{analysis.insights.low_category}</li>}
                {analysis.insights.seasonal_trend && <li>{analysis.insights.seasonal_trend}</li>}
                {analysis.insights.promotion && <li>{analysis.insights.promotion}</li>}
                {analysis.insights.inventory_alert && <li>{analysis.insights.inventory_alert}</li>}
                {analysis.insights.loyal_customer && <li>{analysis.insights.loyal_customer}</li>}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Analyze;

