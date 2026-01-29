# 📊 Restaurant Analytics Dashboard

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

so first run this command
```bash
https://github.com/satyamkumar052/Restaurant-DashBoard.git
```

### 1. Backend Setup
The backend runs on Port `8080`.

1.  Navigate to the backend folder:
    ```bash
    cd backend
    npm install
    ```
2.  **Configure Environment Variables:**
    Create a `.env` file in the `backend` folder and add your MongoDB connection string:
    ```env
    MONGOURL=mongodb://127.0.0.1:27017/restaurant_analytics
    ```
3.  **Seed the Database (Optional):**
    If you need dummy data, run the seeder script:
    ```bash
    node init/data.js
    ```
4.  Start the Server:
    ```bash
    npm run dev
    ```
    *You should see: "Server running on 8080" and "Connected to MongoDB!"*

### 2. Frontend Setup
The frontend runs on Port `3000`.

1.  Open a new terminal and navigate to the frontend folder:
    ```bash
    cd frontend
    npm install
    ```
2.  Start the Development Server:
    ```bash
    npm run dev
    ```
3.  Open your browser and visit: `http://localhost:3000`
