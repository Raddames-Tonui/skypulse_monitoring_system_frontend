import React from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import '@/css/NavigationBar.css';

interface NavLink {
    label: string;
    to: string;
    match?: (pathname: string) => boolean;
}

interface NavigationBarProps {
    links?: NavLink[];
}

const NavigationBar: React.FC<NavigationBarProps> = ({ links = [] }) => {
    const { location } = useRouterState();

    return (
        <>
            <div className="logs-nav">
                {links.map((link) => {
                    const isActive = link.match
                        ? link.match(location.pathname)
                        : location.pathname === link.to || location.pathname.startsWith(link.to);

                    return (
                        <Link key={link.to} to={link.to} className={isActive ? 'btn-primary' : 'btn-secondary'}>
                            {link.label}
                        </Link>
                    );
                })}
            </div>
        </>
    );
};

export default NavigationBar;


// const links = [
//   { label: "Uptime Logs", to: "/reports/uptime-reports", match: (p) => p.includes("uptimelogs") },
//   { label: "SSL Logs", to: "/reports/ssl-reports", match: (p) => p.includes("ssllogs") },
// ];

// <NavigationBar links={links} />
