# 📊 Restaurant Analytics Dashboard

A full-stack MERN analytics dashboard designed to visualize restaurant performance metrics, revenue trends, and operational insights across multiple branches.

## 🚀 Project Overview
This application provides real-time insights for restaurant owners. It includes a comprehensive dashboard for viewing top-performing branches, filtering restaurants by cuisine or location, and deep-diving into individual restaurant analytics using interactive charts.

## 🛠️ Tech Stack
**Frontend:**
* **Next.js** (React Framework)
* **Bootstrap 5** (Styling & Layout)
* **Recharts** (Data Visualization)
* **Lucide React** (Icons)

**Backend:**
* **Node.js & Express.js** (REST API)
* **MongoDB & Mongoose** (Database & Aggregations)
* **Cors & Dotenv** (Middleware)

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### 1. Backend Setup
The backend runs on Port `8080`.

1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Configure Environment Variables:**
    Create a `.env` file in the `backend` folder and add your MongoDB connection string:
    ```env
    MONGOURL=mongodb://127.0.0.1:27017/restaurant_analytics
    ```
4.  **Seed the Database (Optional):**
    If you need dummy data, run the seeder script:
    ```bash
    node init/data.js
    ```
5.  Start the Server:
    ```bash
    npm run dev
    ```
    *You should see: "Server running on 8080" and "Connected to MongoDB!"*

### 2. Frontend Setup
The frontend runs on Port `3000`.

1.  Open a new terminal and navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Development Server:
    ```bash
    npm run dev
    ```
4.  Open your browser and visit: `http://localhost:3000`

---

## 🌟 Key Features

### 1. 🏠 Executive Dashboard
* **Top Performers:** Instantly view the top 3 revenue-generating restaurants.
* **Advanced Filtering:** Filter restaurants by **Cuisine** (Italian, Japanese, etc.) or **Location** (Mumbai, Delhi, etc.).
* **Live Search:** Real-time search by restaurant name.

### 2. 📈 Detailed Analytics (Restaurant View)
Clicking "View Trends" on any restaurant opens a detailed report containing:
* **KPI Cards:** Total Orders, Total Revenue, Avg Order Value, and Peak Hour.
* **Interactive Charts:**
    * **Area Chart:** Daily Order Volume.
    * **Bar Chart:** Daily Revenue Trends.
    * **Line Chart:** Average Order Value fluctuations.
    * **Step Chart:** Peak Order Hour analysis (24h format).

### 3. 🏆 Top Performers Leaderboard

A dedicated page comparing the best branches with gold/silver/bronze highlighting and comparative bar charts.
