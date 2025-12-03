import { createFileRoute, Link } from "@tanstack/react-router";


export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="logo">
          <img src="/skypulse_flavicon.png" alt="" style={{ height: 60 }} />
        </div>
        <div className="nav-actions">
          <Link to="/auth/login" className="btn btn-outline">Login</Link>
        </div>
      </nav>

      <main className="main">
        <div className="hero">
          <h1>Welcome to Sky Pulse</h1>
          <p>
            A modern platform built with simplicity, performance, and elegance
            in mind.
          </p>
          <div className="hero-actions">
            {/* <Link to="/auth/login" className="btn btn-outline">Login</Link> */}
          </div>
        </div>
      </main>




      <style>{`
        :root {
          --bg-default: #ffffff;
          --bg-secondary: #F5F7F9;

          --primary-50: #F7FCFD;
          --primary-100: #E0E9EB;
          --primary-200: #97d9e8;
          --primary-300: #70c9de;
          --primary-400: #4cb9d3;
          --primary-500: #35a0ba;
          --primary-600: #257d9e;
          --primary-700: #144f5c;
          --primary-800: #053640;
          --primary-900: #001419;

          --text-blue: #228BE6;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body, html, .home-container {
          height: 100vh;
          background: var(--bg-default);
          color: var(--primary-800);
        }

        /* Navbar */
        .navbar {
          height: 64px;
          background: var(--bg-secondary);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          border-bottom: 1px solid var(--primary-300);
        }

        .logo {
          font-weight: extra-bold;
          font-size: 1.2rem;
          color: var(--primary-600);
          
        }

        .nav-actions {
          display: flex;
          gap: 1rem;
        }

        /* Main Section */
        .main {
          height: calc(100vh - 64px);
          display: flex;
          justify-content: center;
          align-items: center;
          background: var(--primary-50);
        }

        .hero {
          text-align: center;
          max-width: 600px;
          padding: 2rem;
        }

        .hero h1 {
          font-size: 2.5rem;
          color: var(--primary-700);
          margin-bottom: 1rem;
        }

        .hero p {
          font-size: 1.1rem;
          color: var(--primary-600);
          margin-bottom: 2rem;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .btn {
          padding: 0.6rem 1.4rem;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
          text-decoration: none;
          display: inline-block;
          text-align: center;
        }

        .btn-primary {
          background: var(--primary-500);
          color: #fff;
          border: none;
        }

        .btn-primary:hover {
          background: var(--primary-600);
        }

        .btn-outline {
          background: transparent;
          border: 2px solid var(--primary-500);
          color: var(--primary-500);
        }

        .btn-outline:hover {
          background: var(--primary-100);
        }
      `}</style>
    </div>
  );
}
