import { useState } from "react";
import Icon from "@/utils/Icon";
import { useAuth } from "@/hooks/hooks";
import { useNavigate } from "@tanstack/react-router";

interface NavbarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const [selectedValue, setSelectedValue] = useState("default");
  const [showDropdown, setShowDropdown] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const role = user?.roleName?.toLowerCase() || "";

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/auth/login" });
  };

  const iconClass = `navbar-icon ${isSidebarOpen ? "open" : "collapsed"}`;

  const roleColor = (() => {
    switch (role) {
      case "operator":
        return "var(--text-blue)";
      case "admin":
        return "#FD7E14";
      case "viewer":
        return "#28A745";
      default:
        return "black";
    }
  })();

  return (
    <header>
      <div
        className="mic-icon"
        style={{
          width: isSidebarOpen ? "240px" : "48px",
          transition: "width 0.3s ease",
        }}
      >
        {/* <Icon iconName="microphone" /> */}
        {/* <img src="/SkyPulseFlavicon.png" alt="Skypulse Logo" /> */}


        <div>
          <svg width="100%" height="40" viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
            <polyline
              points="0,25 10,25 20,15 30,35 40,25 50,25 60,10 70,40 80,25 90,25 100,25"
              fill="none"
              stroke="#ffffffff"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="0"
              strokeDashoffset="0"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="20"
                dur="0.5s"
                repeatCount="indefinite"
              />
            </polyline>
          </svg>
        </div>
      </div>

      <div className="header-wrapper">
        <div className="logo">
          <h1 className="responsive-hide">{user?.companyName || "Company Name"}</h1>
          <h2 style={{ color: roleColor }} className="responsive-hide">
            {user?.roleName.toLowerCase() || ""}
          </h2>
        </div>

        <div className="icon-search">
          <select
            name="search"
            id="select-institution"
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
            className="responsive-hide"
          >
            <option value="default" disabled>
              Select Institution
            </option>
            <option value="apstar">Apstar SACCO Limited</option>
            <option value="another">Another Institution</option>
          </select>

          <div className={iconClass}>
            <Icon iconName="notification" />
          </div>

          <div className="avatar-dropdown">
            <div
              className={`${iconClass} avatar-icon`}
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              <Icon iconName="avatar" />
            </div>

            {user && showDropdown && (
              <div className="dropdown-menu show">
                <p className="dropdown-user">{user?.fullName}</p>
                <div className="dropdown-info">
                  <p>
                    <strong>Email:</strong> {user?.email}
                  </p>
                  <p>
                    <strong>Role:</strong> {user?.roleName || "N/A"}
                  </p>
                </div>
                <button className="dropdown-item" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Hamburger for mobile screens */}
          <button
            className="navbar-hamburger mobile-only"
            onClick={toggleSidebar} // toggles Sidebar visibility
          >
            <Icon iconName="hamburger" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
