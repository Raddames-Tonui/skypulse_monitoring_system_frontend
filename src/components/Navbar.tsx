import { useState } from "react";
import Icon from "@/utils/Icon";
import { useAuth } from "@/hooks/hooks";
import { useNavigate } from "@tanstack/react-router";

interface NavbarProps {
  isSidebarOpen: boolean;
  toggleSidebar?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isSidebarOpen}) => {
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
        <Icon iconName="microphone" />
      </div>

      <div className="header-wrapper">
        <div className="logo">
          <h1 className="responsive-hide">{user?.companyName|| "Company Name"}</h1>
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
        </div>
      </div>
    </header>
  );
};

export default Navbar;
