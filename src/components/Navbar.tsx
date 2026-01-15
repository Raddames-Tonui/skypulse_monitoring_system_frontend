import { useState } from "react";
import Icon from "@/utils/Icon";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeProvider";
import GetUserProfileModal from "@/pages/users/GetUserProfileModal";
import { useNavigate } from "@tanstack/react-router";

const Navbar: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const { isSidebarOpen, isMobileSidebarOpen, toggleMobileSidebar } = useTheme();

  const iconClass = `navbar-icon ${isSidebarOpen ? "open" : "collapsed"}`;

  const roleColor = (() => {
    switch (user?.role_name) {
      case "OPERATOR":
        return "#FD7E14";
      case "ADMIN":
        return "#FD1414";
      case "VIEWER":
        return "#28A745";
      default:
        return "black";
    }
  })();

  const getInitials = (first?: string, last?: string) => {
    const f = first?.[0]?.toUpperCase() || "";
    const l = last?.[0]?.toUpperCase() || "";
    return f + l;
  };

  return (
    <header className="header">
      <div
        className="mic-icon"
        style={{ width: isSidebarOpen ? "240px" : "48px", transition: "width 0.3s ease" }}
      >
        <svg width="100%" height="40" viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
          <polyline
            points="0,25 10,25 20,15 30,35 40,25 50,25 60,10 70,40 80,25 90,25 100,25"
            fill="none"
            stroke="#ffffffff"
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
        <div className="logo">
          <h1 className="responsive-hide">{user?.company_name || "Company Name"}</h1>
          <h2 style={{ color: roleColor }} className="responsive-hide">
            {user?.role_name}
          </h2>
        </div>

        <div className="icon-search">
          <div className={iconClass}>
            <Icon iconName="notification" />
          </div>

          <div className="avatar-dropdown">
            <div
              className={`${iconClass} avatar-icon initials`}
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              {getInitials(user?.first_name, user?.last_name)}
            </div>

            {showDropdown && (
              <div className="dropdown-menu show">
                <p className="dropdown-user">{user?.first_name} {user?.last_name}</p>

                <div className="dropdown-info">
                  <p><strong>Role:</strong> {user?.role_name}</p>
                  <p><strong>Alert Channel:</strong> {user?.user_preferences.alert_channel}</p>
                  <p><strong>Weekly Reports:</strong> {user?.user_preferences.receive_weekly_reports ? "Yes" : "No"}</p>
                  <p><strong>Language:</strong> {user?.user_preferences.language}</p>
                  <p><strong>Timezone:</strong> {user?.user_preferences.timezone}</p>

                  <button
                    type="button"
                    className="settings-btn"
                    onClick={() => navigate({ to: "/user/profile" })}
                  >
                    <Icon iconName="settings" />
                    Settings
                  </button>
                </div>

                <button className="dropdown-item" onClick={logout}>
                  Logout
                </button>
              </div>
            )}
          </div>

          <button className="navbar-hamburger mobile-only" onClick={toggleMobileSidebar}>
            <Icon iconName={isMobileSidebarOpen ? "closeMobile" : "hamburger"} />
          </button>
        </div>
      </div>

      <GetUserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </header>
  );
};

export default Navbar;
