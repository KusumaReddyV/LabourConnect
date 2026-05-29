import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/layout.css';

export default function Navbar() {
  const { user, logout, dashboardPath, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isClient = user?.role === 'client';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="site-header">
      <nav id="navbar">
        <Link to="/" className="nav-brand">
          <i className="fa-solid fa-house" /> HOME
        </Link>
        <NavLink to="/#about">ABOUT</NavLink>
        <NavLink to="/#services">SERVICES</NavLink>
        {isAuthenticated && isClient && (
          <a href="/#workers" className="nav-hash-link">FIND WORKERS</a>
        )}
        <NavLink to="/helpdesk">HELP DESK</NavLink>
        {!isAuthenticated ? (
          <NavLink to="/login">SIGN IN</NavLink>
        ) : (
          <NavLink to={dashboardPath}>DASHBOARD</NavLink>
        )}
        <div className="dropdown">
          <span className="dropdown-trigger">
            PROFILE <i className="fa-solid fa-circle-chevron-down" />
          </span>
          <div className="dropdown-content">
            {isAuthenticated ? (
              <>
                <Link to="/account">Account</Link>
                <Link to={dashboardPath}>Dashboard</Link>
                {isClient && <a href="/#workers">Find Workers</a>}
                <button type="button" className="dropdown-btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Sign In</Link>
                <Link to="/register/labour">Register-Labour</Link>
                <Link to="/register/client">Register-Client</Link>
              </>
            )}
            <Link to="/helpdesk">Help</Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
