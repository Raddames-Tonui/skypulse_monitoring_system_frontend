import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";


export interface ThemeContextType {
      isSidebarOpen: boolean;
    toggleSidebar: () => void;
    isMobileSidebarOpen: boolean;
    toggleMobileSidebar: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {

    const [isSidebarOpen, setSidebarOpen] = useState<boolean>(() => {
        const saved = sessionStorage.getItem("isSidebarOpen");
        return saved === null ? true : saved === "true";
    });

    const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(prev => {
            const newState = !prev;
            sessionStorage.setItem("isSidebarOpen", newState.toString());
            return newState;
        });
    };

    const toggleMobileSidebar = () => {
        setMobileSidebarOpen(prev => !prev);
    };

    return (
        <ThemeContext.Provider value={{
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