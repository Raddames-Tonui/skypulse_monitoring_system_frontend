import { Link, useRouterState } from '@tanstack/react-router'

function NavigationBar() {
    const route = useRouterState().location.pathname

    return (
        <div className="page-header">
            <div className="logs-nav">
                <Link
                    to="/logs/uptimelogs"
                    className={route.includes('uptimelogs') ? 'active-tab' : ''}
                >
                    Uptime Logs
                </Link>

                <Link
                    to="/logs/ssllogs"
                    className={route.includes('ssllogs') ? 'active-tab' : ''}
                >
                    SSL Logs
                </Link>
            </div>
        </div>
    )
}

export default NavigationBar