import React, { useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import Icon from "@/utils/Icon";
import type { IconName } from "@/utils/IconsList";
import { useAuth } from "@/hooks/hooks";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const menuConfig: Record<string, { icon: IconName; label: string; path: string }[]> = {
  admin: [
    { icon: "pie", label: "Odata Dashboard", path: "/dashboard" },
    { icon: "user", label: "Users", path: "/users" },
    { icon: "users", label: "Groups", path: "/groups" },
    { icon: "services", label: "Services", path: "/services" },
    { icon: "settings", label: "Settings", path: "/settings" },
  ],
  operator: [
    { icon: "pie", label: "Operator Dashboard", path: "/dashboard" },
  ],
  viewer: [
    { icon: "pie", label: "Viewer Dashboard", path: "/dashboard" },
  ],
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  const userRole = user?.roleName.toLowerCase() || "";
  const menuItems = menuConfig[userRole] || [];

  useEffect(() => {
    if (!isLoading && !menuItems.length) {
      navigate({ to: "/auth/unauthorized" });
    }
  }, [isLoading, menuItems.length, navigate]);

  if (isLoading || !user) {
    return null;
  }

  return (
    <aside className="sidebar" style={{ width: isOpen ? "240px" : "48px" }}>
      <div className="aside-icons">
        {menuItems.map((item) => (
          <Link
            key={item.icon}
            to={item.path}
            className="sidebar-item"
            title={!isOpen ? item.label : ""}
          >
            <Icon iconName={item.icon} />
            {isOpen && <span className="sidebar-label">{item.label}</span>}
          </Link>
        ))}
      </div>

      <div className="close-icon" onClick={toggleSidebar}>
        <Icon iconName={isOpen ? "close" : "open"} />
        <span className="sidebar-label">Close</span>
      </div>
    </aside>
  );
};

export default Sidebar;
