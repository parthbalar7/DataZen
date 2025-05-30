📊 DataZen

DataZen is an AI-powered analytics dashboard that transforms raw CSV-based sales data into interactive visual insights, intelligent forecasts, and actionable recommendations. Designed for small businesses like **Smoke Dollar Grocery**, DataZen provides an all-in-one platform for sales analysis, inventory alerts, customer segmentation, and demand forecasting.

🚀 Features

🧠 Intelligent Analysis
- Upload your sales CSV and instantly visualize:
  - Sales Over Time
  - Sales by Product & Category
  - Inventory vs Sales Trends
  - Region-wise Heatmaps and Treemaps
  - Seasonal Drop Alerts
  - Sales Forecasts using **Prophet** and **LSTM**

📦 Inventory Monitoring
- Automatic low-stock warnings
- Reorder point suggestions
- Sales vs Inventory correlation charts

🛍 Customer Segmentation
- RFM (Recency, Frequency, Monetary) Analysis
- KMeans Clustering
- Cluster-wise behavioral insights
- Top 10 customers listed by frequency

🔐 Authentication (with MongoDB)
- JWT-based secure login/signup
- MongoDB Atlas used to store user credentials

🧭 Intuitive UI
- Built-in guided tutorials
- Accordion-based charts
- Responsive and interactive layout

Installation Guide

1. Clone the repository
git clone https://github.com/parthbalar7/datazen.git
cd datazen

2. Install Backend Dependencies (Python)
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

3. Start Backend Server
uvicorn main:app --reload --port 8008

4. Setup Frontend
cd ../frontend
npm install
npm run start

Frontend: http://localhost:3000
Backend:  http://localhost:8008
