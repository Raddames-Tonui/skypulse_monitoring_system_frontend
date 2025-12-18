import { Link } from "@tanstack/react-router";
import "@/css/home/home.css";

function Navbar() {
  return (
    <header className="home-navbar">
      <div className="navbar-inner">
        <div className="brand">
          <img
            src="/skypulse_flavicon.png"
            alt="SkyPulse Monitor"
            className="navbar-logo"
          />
        </div>

        <nav className="nav-actions">
          <Link to="/auth/login" className="nav-link">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
