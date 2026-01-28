// -----------SIDEBAR PROPS ----------------------
import type {IconName} from "@/utils/IconsList.tsx";

export interface MenuItem {
    icon: IconName;
    label: string;
    path: string;
}

export const menuConfig: Record<string, MenuItem[]> = {
    admin: [
        {icon: "dashboard", label: "Dashboard", path: "/dashboard"},
        {icon: "services", label: "Services", path: "/services"},
        {icon: "user", label: "Users", path: "/users"},
        {icon: "users", label: "Groups", path: "/groups"},
        {icon: "notepad", label: "Reports", path: "/reports/uptime-reports"},
        {icon: "messageLight", label: "Notifications", path: "/notification-history"},
        {icon: "paperLight", label: "Templates", path: "/templates"},
        {icon: "history", label: "Audit Logs", path: "/audit-logs"},
        {icon: "settings", label: "Settings", path: "/settings"},
    ],
    operator: [
        {icon: "dashboard", label: "Dashboard", path: "/dashboard"},
        {icon: "services", label: "Services", path: "/services"},
        {icon: "notepad", label: "Reports", path: "/reports/uptime-reports"},
    ],
    viewer: [
        {icon: "dashboard", label: "Dashboard", path: "/dashboard"},
        {icon: "services", label: "Services", path: "/services"},
        {icon: "notepad", label: "Reports", path: "/reports/uptime-reports"},
    ],
};