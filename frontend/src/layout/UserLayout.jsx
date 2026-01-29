import Link from "next/link";
import { useRouter } from "next/router";
import { BarChart3, Home, Award, Settings } from "lucide-react";

export default function UserLayout({ children }) {
  const router = useRouter();
  const path = router.pathname;

  // Logic: Active if on Home OR inside a Restaurant Details page
  const isRestaurantsActive = path === '/' || path.includes('/restaurant');

  // Logic: Active if inside the TopPerformer folder
  const isTopActive = path.includes('/TopPerformer');

  return (
    <div className="container-fluid bg-light min-vh-100 font-sans">
      <div className="row">
        
        {/* --- SIDEBAR --- */}
        <div className="col-md-2 bg-white border-end vh-100 position-fixed d-none d-md-block pt-4 ps-3 pe-3">
          
          {/* Logo Section */}
          <div className="d-flex align-items-center mb-5 ps-2">
            <BarChart3 className="text-primary me-2" size={28} strokeWidth={2.5} />
            <span className="fw-bold h5 mb-0 text-dark" style={{ letterSpacing: '-0.5px' }}>RestoAnalytics</span>
          </div>

          {/* Navigation Items */}
          <nav className="nav flex-column">
            
            {/* 1. RESTAURANTS TAB */}
            <Link 
              href="/" 
              className={`nav-link d-flex align-items-center px-3 py-2 mb-2 rounded-3 transition-all ${
                isRestaurantsActive 
                  ? 'bg-secondary-subtle text-dark fw-bold' 
                  : 'text-secondary hover-bg-light'
              }`}
            >
              <Home size={20} className="me-3" />
              <span>Restaurants</span>
            </Link>

            {/* 2. TOP PERFORMERS TAB (UPDATED) */}
            <Link 
              href="/TopPerformer" 
              className={`nav-link d-flex align-items-center px-3 py-2 mb-2 rounded-3 transition-all ${
                isTopActive
                  ? 'bg-secondary-subtle text-dark fw-bold'
                  : 'text-secondary'
              }`}
            >
              <Award size={20} className="me-3" />
              <span>Top Performers</span>
            </Link>

            {/* 3. SETTINGS TAB */}
            <Link 
              href="#" 
              className="nav-link d-flex align-items-center px-3 py-2 mb-2 rounded-3 text-secondary"
            >
              <Settings size={20} className="me-3" />
              <span>Settings</span>
            </Link>

          </nav>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="col-md-10 offset-md-2 p-0">
            <div className="p-4">
                {children}
            </div>
        </div>
        
      </div>

      <style jsx>{`
        .transition-all {
          transition: all 0.2s ease-in-out;
        }
        .bg-secondary-subtle {
          background-color: #f3f4f6 !important; 
        }
        .nav-link:hover {
            background-color: #f8f9fa;
            color: #000;
        }
      `}</style>
    </div>
  );
}