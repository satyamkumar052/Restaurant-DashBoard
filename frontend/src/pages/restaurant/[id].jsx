import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchTrends, fetchRestaurants } from "../../utils/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import { ShoppingCart, DollarSign, Clock } from "lucide-react";
import Head from "next/head";

export default function RestaurantAnalytics() {
  const router = useRouter();
  const { id } = router.query;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restaurantName, setRestaurantName] = useState("");
  const [startDate, setStartDate] = useState("2025-06-01");
  const [endDate, setEndDate] = useState("2025-07-01");

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const trendsData = await fetchTrends(id, { start_date: startDate, end_date: endDate });
        setData(trendsData || []);

        const listData = await fetchRestaurants({ limit: 100 });
        const found = listData.data.find((r) => r._id == id);
        if (found) setRestaurantName(found.name);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    loadData();
  }, [id, startDate, endDate]);

  if (loading) return <div className="p-5 text-center">Loading analytics...</div>;

  // Metrics Logic
  const totalRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalOrders = data.reduce((acc, curr) => acc + curr.orders, 0);
  const avgOrderValue = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;
  
  const peakHourCounts = {};
  data.forEach(d => {
    if(d.peak_hour) peakHourCounts[d.peak_hour] = (peakHourCounts[d.peak_hour] || 0) + 1;
  });
  const overallPeakHour = Object.keys(peakHourCounts).reduce((a, b) => peakHourCounts[a] > peakHourCounts[b] ? a : b, 0);

  return (
    <>
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h2 className="fw-bold">Restaurant Trends: {restaurantName}</h2>
            <p className="text-muted">Overview of your performance metrics.</p>
        </div>
        <div className="d-flex gap-2">
            <input type="date" className="form-control" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <input type="date" className="form-control" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
        </div>

        {/* KPI Cards */}
        <div className="row g-3 mb-4">
        <div className="col-md-3">
            <div className="card border-0 shadow-sm p-3" style={{ backgroundColor: '#eef2ff' }}>
            <div className="d-flex align-items-center">
                <div className="p-3 bg-white rounded-circle me-3 text-primary">
                    <ShoppingCart size={24} />
                </div>
                <div>
                    <p className="text-muted mb-0 small">Total Orders</p>
                    <h4 className="fw-bold mb-0">{totalOrders}</h4>
                </div>
            </div>
            </div>
        </div>
        <div className="col-md-3">
            <div className="card border-0 shadow-sm p-3" style={{ backgroundColor: '#ecfdf5' }}>
            <div className="d-flex align-items-center">
                <div className="p-3 bg-white rounded-circle me-3 text-success">
                    <DollarSign size={24} />
                </div>
                <div>
                    <p className="text-muted mb-0 small">Total Revenue</p>
                    <h4 className="fw-bold mb-0">${totalRevenue.toLocaleString()}</h4>
                </div>
            </div>
            </div>
        </div>
        <div className="col-md-3">
            <div className="card border-0 shadow-sm p-3" style={{ backgroundColor: '#f0fdf4' }}>
            <div className="d-flex align-items-center">
                <div className="p-3 bg-white rounded-circle me-3 text-success">
                    <DollarSign size={24} />
                </div>
                <div>
                    <p className="text-muted mb-0 small">Avg Order Value</p>
                    <h4 className="fw-bold mb-0">${avgOrderValue}</h4>
                </div>
            </div>
            </div>
        </div>
        <div className="col-md-3">
            <div className="card border-0 shadow-sm p-3" style={{ backgroundColor: '#eff6ff' }}>
            <div className="d-flex align-items-center">
                <div className="p-3 bg-white rounded-circle me-3 text-info">
                    <Clock size={24} />
                </div>
                <div>
                    <p className="text-muted mb-0 small">Peak Hour</p>
                    <h4 className="fw-bold mb-0">{overallPeakHour}:00</h4>
                </div>
            </div>
            </div>
        </div>
        </div>

        {/* Charts Grid */}
        <div className="row g-4">
        <div className="col-md-6">
            <div className="card border-0 shadow-sm p-3 h-100">
                <h6 className="fw-bold mb-3">Daily Orders Count</h6>
                <div style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tick={{fontSize: 12}} />
                    <YAxis tick={{fontSize: 12}} />
                    <Tooltip />
                    <Area type="monotone" dataKey="orders" stroke="#3b82f6" fillOpacity={1} fill="url(#colorOrders)" />
                    </AreaChart>
                </ResponsiveContainer>
                </div>
            </div>
        </div>

        <div className="col-md-6">
            <div className="card border-0 shadow-sm p-3 h-100">
                <h6 className="fw-bold mb-3">Daily Revenue</h6>
                <div style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tick={{fontSize: 12}} />
                    <YAxis tick={{fontSize: 12}} />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
                </div>
            </div>
        </div>

        <div className="col-md-6">
            <div className="card border-0 shadow-sm p-3 h-100">
                <h6 className="fw-bold mb-3">Average Order Value</h6>
                <div style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tick={{fontSize: 12}} />
                    <YAxis tick={{fontSize: 12}} />
                    <Tooltip />
                    <Line type="monotone" dataKey="avg_order_value" stroke="#10b981" strokeWidth={3} dot={{r: 4}} />
                    </LineChart>
                </ResponsiveContainer>
                </div>
            </div>
        </div>

        <div className="col-md-6">
            <div className="card border-0 shadow-sm p-3 h-100">
                <h6 className="fw-bold mb-3">Peak Order Hour (24h)</h6>
                <div style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tick={{fontSize: 12}} />
                    <YAxis domain={[0, 24]} tick={{fontSize: 12}} />
                    <Tooltip />
                    <Line type="step" dataKey="peak_hour" stroke="#f59e0b" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
                </div>
            </div>
        </div>
        </div>
    </>
  );
}