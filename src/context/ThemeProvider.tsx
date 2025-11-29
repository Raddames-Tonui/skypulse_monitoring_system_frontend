import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type ThemeType = "light" | "dark";

export interface ThemeContextType {
    theme: ThemeType;
    toggleTheme: () => void;
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    isMobileSidebarOpen: boolean;
    toggleMobileSidebar: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<ThemeType>(() => {
        return (localStorage.getItem("theme") as ThemeType) || "light";
    });

    const [isSidebarOpen, setSidebarOpen] = useState<boolean>(() => {
        const saved = localStorage.getItem("isSidebarOpen");
        return saved === null ? true : saved === "true";
    });

    const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const toggleTheme = () => {
        setTheme(prev => {
            const newTheme = prev === "light" ? "dark" : "light";
            localStorage.setItem("theme", newTheme);
            document.documentElement.classList.remove(prev);
            document.documentElement.classList.add(newTheme);
            return newTheme;
        });
    };

    const toggleSidebar = () => {
        setSidebarOpen(prev => {
            const newState = !prev;
            localStorage.setItem("isSidebarOpen", newState.toString());
            return newState;
        });
    };

    const toggleMobileSidebar = () => {
        setMobileSidebarOpen(prev => !prev);
    };

    return (
        <ThemeContext.Provider value={{
            theme,
            toggleTheme,
            isSidebarOpen,
            toggleSidebar,
            isMobileSidebarOpen,
            toggleMobileSidebar
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within a ThemeProvider");
    return context;
};