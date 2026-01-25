import { Link } from "@tanstack/react-router";
import "@/css/home/home.css";

function HomeNavbar() {
  return (
      <header className="home-navbar-root">
        <div className="home-navbar-inner">
          <div className="home-navbar-brand">
            <img
                src="/skypulse_flavicon.png"
                alt="SkyPulse Monitor"
                className="home-navbar-logo"
            />
          </div>

          <div className="home-navbar-actions">
            <Link to="/auth/login" className="home-navbar-link">
              Login
            </Link>
          </div>
        </div>
      </header>
  );
}

export default HomeNavbar;
