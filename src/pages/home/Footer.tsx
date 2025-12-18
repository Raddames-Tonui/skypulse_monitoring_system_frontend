import "@/css/home/home.css";

const APP_VERSION = import.meta.env.VITE_APP_VERSION || "v1.0.0";
const BUILD_ID = import.meta.env.VITE_BUILD_ID || "local";

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="site-footer ">

            <nav className="footer-nav">
                <a href="https://skypuls-ms-docs.netlify.app" target="_blank">Docs</a>
                <a href="/status">Status</a>
                <a href="/#">Privacy</a>
                <a href="/#">Terms</a>
                <a href="/#">Support</a>
            </nav>
            <div className="footer-inner">

                <div className="footer-text">
                    <p>
                        &copy; {currentYear} @SkyPulse Monitor
                    </p>

                    <span className="build-tag">
                        SkyPulse Monitor — {APP_VERSION} • {BUILD_ID}
                    </span>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
