import { useState } from "react";
import Icon from "@/utils/Icon";
import { useAuth } from "@/hooks/hooks";

interface NavbarProps {
  isSidebarOpen: boolean;
  toggleSidebar?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const [selectedValue, setSelectedValue] = useState("default");
  const [showDropdown, setShowDropdown] = useState(false);

  const { user, logout } = useAuth();
  const role = user?.role_name?.toLowerCase() || ""; 

  const handleLogout = () => logout();

  const iconClass = `navbar-icon ${isSidebarOpen ? "open" : "collapsed"}`;

  // Determine color based on role
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
          <h1 className="responsive-hide">{user?.company_name || "Company Name"}</h1>
          <h2 style={{ color: roleColor }} className="responsive-hide">
            {role.toUpperCase()}
          </h2>
        </div>

        <div className="icon-search">
          <div className={iconClass}>
            <Icon iconName="add" />
          </div>
          <div className={iconClass}>
            <Icon iconName="search" />
          </div>

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
                <p className="dropdown-user">{user.full_name}</p>
                <div className="dropdown-info">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Role:</strong> {user.role_name}</p>
                  {/* Optional: you can add status if backend sends it */}
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
