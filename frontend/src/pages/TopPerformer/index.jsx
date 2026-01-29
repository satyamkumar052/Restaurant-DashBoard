import { useState, useEffect } from "react";
import { fetchTopRestaurants } from "../../utils/api"; // Path is correct for 2 levels deep
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { Trophy, TrendingUp, Award } from "lucide-react";

export default function TopPerformers() {
  const [topRestaurants, setTopRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchTopRestaurants();
        setTopRestaurants(data || []);
      } catch (error) {
        console.error("Error fetching top performers:", error);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <div className="p-5 text-center text-muted">Loading leaderboard...</div>;

  return (
    <>
      {/* Header */}
      <div className="mb-5">
        <h2 className="fw-bold text-dark">Top Performers</h2>
        <p className="text-muted">Highest revenue generating branches this month.</p>
      </div>

      {/* --- LEADERBOARD CARDS --- */}
      <div className="row g-4 mb-5">
        {topRestaurants.map((resto, index) => (
          <div key={resto.restaurant_id} className="col-md-4">
            <div className={`card border-0 shadow-sm p-4 h-100 position-relative overflow-hidden ${index === 0 ? 'bg-primary text-white' : 'bg-white'}`}>
              
              {/* Rank Badge Background Number */}
              <div className="position-absolute top-0 end-0 p-3 opacity-25">
                <span className="display-1 fw-bold">{index + 1}</span>
              </div>

              <div className="position-relative z-1">
                <div className="d-flex align-items-center mb-4">
                  <div className={`p-3 rounded-circle me-3 ${index === 0 ? 'bg-white text-primary' : 'bg-light text-dark'}`}>
                    {index === 0 ? <Trophy size={28} /> : <Award size={28} />}
                  </div>
                  <div>
                    <h5 className={`fw-bold mb-0 ${index === 0 ? 'text-white' : 'text-dark'}`}>{resto.name}</h5>
                    <small className={index === 0 ? 'text-white-50' : 'text-muted'}>Rank #{index + 1}</small>
                  </div>
                </div>
                
                <h2 className="fw-bold mb-0">${resto.revenue.toLocaleString()}</h2>
                <p className={index === 0 ? 'text-white-50' : 'text-muted'}>Total Revenue</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- COMPARISON CHART --- */}
      <div className="card border-0 shadow-sm p-4">
        <div className="d-flex align-items-center mb-4">
            <TrendingUp className="text-primary me-2" />
            <h5 className="fw-bold mb-0">Revenue Comparison</h5>
        </div>
        
        <div style={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topRestaurants} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{fontSize: 14, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="revenue" radius={[10, 10, 0, 0]} barSize={60}>
                {topRestaurants.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#0d6efd' : '#e2e8f0'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}