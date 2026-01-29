import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, Utensils, TrendingUp, ArrowRight, AlertTriangle } from "lucide-react";
import { fetchRestaurants, fetchTopRestaurants } from "../utils/api";

export default function Home() {
    // State
    const [restaurants, setRestaurants] = useState([]);
    const [topRestaurants, setTopRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters
    const [search, setSearch] = useState("");
    const [cuisine, setCuisine] = useState("");
    const [location, setLocation] = useState("");

    // 1. Fetch Top Performers (Safe Mode)
    useEffect(() => {
        const loadTop = async () => {
            try {
                const data = await fetchTopRestaurants();
                if (data) {
                    setTopRestaurants(data);
                }
            } catch (err) {
                console.error("Top API Error:", err);
            }
        };
        loadTop();
    }, []);

    // 2. Fetch Restaurant List (Main Data)
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null); // Reset error before fetching

            try {
                // Fetch data
                const data = await fetchRestaurants({ search, cuisine, location });

                if (data && data.data) {
                    // SUCCESS: Server is running and returned data
                    setRestaurants(data.data);
                } else if (data === null) {
                    // FAILURE: Server returned null (likely connection refused)
                    setError("Cannot connect to the Backend Server. Is it running on port 8080?");
                    setRestaurants([]); 
                } else {
                    // EDGE CASE: Empty response
                    setRestaurants([]);
                }
            } catch (e) {
                console.error("Unexpected Error:", e);
                setError("An unexpected error occurred.");
            }
            
            setLoading(false);
        };

        const debounce = setTimeout(loadData, 300);
        return () => clearTimeout(debounce);
    }, [search, cuisine, location]);

    return (
        <>
            {/* Page Header */}
            <div className="mb-4">
                <h2 className="fw-bold text-dark">Dashboard Overview</h2>
                <p className="text-muted">Track revenue and performance across all branches.</p>
            </div>

            {/* --- ERROR ALERT (Shows only if Backend is down) --- */}
            {error && (
                <div className="alert alert-danger d-flex align-items-center mb-4 shadow-sm border-0" role="alert">
                    <AlertTriangle className="me-3" size={24} />
                    <div>
                        <strong>Connection Error:</strong> {error}
                        <div className="small mt-1">Run <code>npm run dev</code> in the backend folder to fix this.</div>
                    </div>
                </div>
            )}

            {/* --- TOP PERFORMERS SECTION --- */}
            <div className="row mb-5">
                {topRestaurants.map((resto, index) => (
                    <div key={resto.restaurant_id} className="col-md-4">
                        <div className="card border-0 shadow-sm p-3 h-100 bg-white">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div className="d-flex align-items-center">
                                    <div className={`p-3 rounded-circle me-3 ${index === 0 ? 'bg-warning-subtle text-warning-emphasis' : 'bg-primary-subtle text-primary'}`}>
                                        <TrendingUp size={24} />
                                    </div>
                                    <div>
                                        <p className="text-muted mb-0 small text-uppercase fw-bold">Rank #{index + 1}</p>
                                        <h5 className="fw-bold mb-0">{resto.name}</h5>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="fw-bold mb-0 text-success">${resto.revenue.toLocaleString()}</h3>
                                <p className="text-muted small">Total Revenue</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- FILTERS SECTION --- */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                    <div className="row g-3">
                        {/* Search */}
                        <div className="col-md-5">
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                    <Search size={18} className="text-secondary" />
                                </span>
                                <input
                                    type="text"
                                    className="form-control bg-light border-start-0 ps-0"
                                    placeholder="Search restaurants..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        {/* Cuisine Filter */}
                        <div className="col-md-3">
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                    <Utensils size={18} className="text-secondary" />
                                </span>
                                <select 
                                    className="form-select bg-light border-start-0 ps-0" 
                                    value={cuisine} 
                                    onChange={(e) => setCuisine(e.target.value)}
                                >
                                    <option value="">All Cuisines</option>
                                    <option value="Italian">Italian</option>
                                    <option value="Japanese">Japanese</option>
                                    <option value="North Indian">North Indian</option>
                                    <option value="American">American</option>
                                </select>
                            </div>
                        </div>
                        {/* Location Filter */}
                        <div className="col-md-3">
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                    <MapPin size={18} className="text-secondary" />
                                </span>
                                <select 
                                    className="form-select bg-light border-start-0 ps-0" 
                                    value={location} 
                                    onChange={(e) => setLocation(e.target.value)}
                                >
                                    <option value="">All Locations</option>
                                    <option value="Mumbai">Mumbai</option>
                                    <option value="Delhi">Delhi</option>
                                    <option value="Bangalore">Bangalore</option>
                                    <option value="Hyderabad">Hyderabad</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- RESTAURANT LIST --- */}
            <h5 className="fw-bold text-dark mb-3">All Restaurants</h5>
            
            <div className="row g-4">
                {loading ? (
                    <div className="col-12 text-center py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                        <p className="mt-2 text-muted">Loading branches...</p>
                    </div>
                ) : restaurants.length > 0 ? (
                    restaurants.map((resto) => (
                        <div key={resto._id} className="col-md-6 col-lg-6">
                            <div className="card border-0 shadow-sm h-100 hover-card">
                                <div className="card-body p-4 d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="fw-bold text-dark mb-1">{resto.name}</h5>
                                        <div className="d-flex gap-2 mt-2">
                                            <span className="badge bg-light text-dark border fw-normal px-2 py-1">
                                                {resto.cuisine}
                                            </span>
                                            <span className="badge bg-light text-secondary border fw-normal px-2 py-1 d-flex align-items-center">
                                                <MapPin size={12} className="me-1" /> {resto.location}
                                            </span>
                                        </div>
                                    </div>
                                    <Link 
                                        href={`/restaurant/${resto._id}`} 
                                        className="btn btn-outline-primary btn-sm rounded-pill px-3 d-flex align-items-center"
                                    >
                                        View Trends <ArrowRight size={16} className="ms-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        {/* Logic: If there is an error, we don't show "No results found", we show nothing (alert handles it) */}
                        {!error && (
                            <div className="alert alert-light border text-center text-muted">
                                No restaurants found matching your filters.
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style jsx>{`
                .hover-card {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .hover-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 .5rem 1rem rgba(0,0,0,.1) !important;
                }
                .bg-warning-subtle { background-color: #fff3cd !important; }
                .text-warning-emphasis { color: #664d03 !important; }
                .bg-primary-subtle { background-color: #cfe2ff !important; }
            `}</style>
        </>
    );
}