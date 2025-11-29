import React from "react";
import { Link } from "@tanstack/react-router";
import Icon from "@/utils/Icon";
import { useAuth } from "@/hooks/hooks";
import { useTheme } from "@/context/ThemeProvider";
import { menuConfig } from "@/utils/types";


const MobileSidebar: React.FC = () => {
    const { user, isLoading } = useAuth();
    const { isMobileSidebarOpen, toggleMobileSidebar } = useTheme();

    if (isLoading || !user) return null;

    const role = user?.roleName?.toLowerCase() || "";
    const menuItems = menuConfig[role] || [];

    return (
        <div className={`mobile-sidebar-overlay ${isMobileSidebarOpen ? "open" : ""}`}>
            <div className="mobile-sidebar-header">
                <button className="close-btn" onClick={toggleMobileSidebar}>
                    <Icon iconName="close" className="text-white w-6 h-6" />
                </button>
            </div>
            <div className="mobile-sidebar-menu">
                {menuItems.map(item => (
                    <Link
                        key={item.icon}
                        to={item.path}
                        className="sidebar-item"
                        onClick={toggleMobileSidebar}
                    >
                        <Icon iconName={item.icon} />
                        <span className="sidebar-label">{item.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default MobileSidebar;