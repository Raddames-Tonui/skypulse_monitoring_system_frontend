import { LastRouteContext } from "@/hooks/hooks";
import {  useState } from "react";
import type { ReactNode } from "react";




export const LastRouteProvider = ({ children }: { children: ReactNode }) => {
  const [lastRoute, setLastRoute] = useState(() => sessionStorage.getItem("lastRoute") || "/");

  const saveRoute = (path: string) => {
    sessionStorage.setItem("lastRoute", path);
    setLastRoute(path);
  };

  return (
    <LastRouteContext.Provider value={{ lastRoute, setLastRoute: saveRoute }}>
      {children}
    </LastRouteContext.Provider>
  );
};

