import Icon from "@/utils/Icon";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeProvider";
import { useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";

const Navbar: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isSidebarOpen, isMobileSidebarOpen, toggleMobileSidebar } = useTheme();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const iconClass = `navbar-icon ${isSidebarOpen ? "open" : "collapsed"}`;

  const roleColor = (() => {
    switch (user?.role_name) {
      case "OPERATOR": return "#FD7E14";
      case "ADMIN": return "#FD1414";
      case "VIEWER": return "#28A745";
      default: return "black";
    }
  })();

  const getInitials = (first?: string, last?: string) => {
    const f = first?.[0]?.toUpperCase() || "";
    const l = last?.[0]?.toUpperCase() || "";
    return f + l;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header">
      {/* Sidebar mic icon animation */}
      <div
        className="mic-icon"
        style={{ width: isSidebarOpen ? "240px" : "48px", transition: "width 0.3s ease" }}
      >
        <svg width="100%" height="40" viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
          <polyline
            points="0,25 10,25 20,15 30,35 40,25 50,25 60,10 70,40 80,25 90,25 100,25"
            fill="none"
            stroke="#fff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
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

      <div className="header-wrapper">
        {/* Logo + Role */}
        <div className="logo">
          <h1 className="responsive-hide">{user?.company_name || "Company Name"}</h1>
          <h2 style={{ color: roleColor }} className="responsive-hide">{user?.role_name}</h2>
        </div>

        <div className="icon-search">
          {/* Notifications */}
          <div className={iconClass}>
            <Icon iconName="notification" />
          </div>



          <div className="avatar-dropdown" ref={dropdownRef}>
            <div
              className={`${iconClass} avatar-icon initials`}
              onClick={() => setShowDropdown(prev => !prev)}
            >
              {getInitials(user?.first_name, user?.last_name)}
            </div>

            {showDropdown && (
              <div className="dropdown-menu show">
                <p className="dropdown-user">{user?.first_name} {user?.last_name}</p>
                  <button className="dropdown-info"
                    onClick={() => navigate({ to: "/user/profile" })}
                  >Go to Profile
                  </button>

                <button className="dropdown-item" onClick={logout}>Logout</button>
              </div>
            )}
          </div>

          <button className="navbar-hamburger mobile-only" onClick={toggleMobileSidebar}>
            <Icon iconName={isMobileSidebarOpen ? "closeMobile" : "hamburger"} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
