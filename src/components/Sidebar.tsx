import React, { useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import Icon from "@/utils/Icon";
import { useAuth } from "@/hooks/hooks";
import { useTheme } from "@/context/ThemeProvider"; 
import { menuConfig } from "@/utils/types";

const Sidebar: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { isSidebarOpen, toggleSidebar } = useTheme();

  const userRole = user?.roleName?.toLowerCase() || "";
  const menuItems = menuConfig[userRole] || [];

  useEffect(() => {
    if (!isLoading && !menuItems.length) {
      navigate({ to: "/auth/unauthorized" });
    }
  }, [isLoading, menuItems.length, navigate]);

  if (isLoading || !user) return null;

  return (
    <aside
      className="sidebar"
      style={{ width: isSidebarOpen ? "240px" : "48px" }}
    >
      <div className="aside-icons">
        {menuItems.map(item => (
          <Link
            key={item.icon}
            to={item.path}
            className="sidebar-item"
            title={!isSidebarOpen ? item.label : ""}
          >
            <Icon iconName={item.icon} />
            {isSidebarOpen && <span className="sidebar-label">{item.label}</span>}
          </Link>
        ))}
      </div>

      <div className="close-icon" onClick={toggleSidebar}>
        <Icon iconName={isSidebarOpen ? "close" : "open"} />
        <span className="sidebar-label">{isSidebarOpen ? "Close" : "Open"}</span>
      </div>
    </aside>
  );
};

export default Sidebar;
