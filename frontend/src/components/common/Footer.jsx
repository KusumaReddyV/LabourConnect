import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SERVICE_CATALOG } from '../../utils/constants';
import '../../styles/footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  const { isAuthenticated, user } = useAuth();
  const isClient = isAuthenticated && user?.role === 'client';

  return (
    <footer className="site-footer-modern">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="footer-logo-mark">LC</span>
            <span className="footer-logo-text">Labour Connect</span>
          </div>
          <p className="footer-tagline">
            Connecting skilled workers with clients who need reliable help — trusted, transparent, local.
          </p>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <i className="fa-brands fa-facebook-f" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
              <i className="fa-brands fa-twitter" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <i className="fa-brands fa-instagram" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <i className="fa-brands fa-linkedin-in" />
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/start">Get Started</Link></li>
            {isClient ? (
              <li><a href="/#workers">Find Workers</a></li>
            ) : (
              <li>
                <Link to="/login" state={{ message: 'Sign in as a client to hire workers' }}>
                  Find Workers
                </Link>
              </li>
            )}
            <li><Link to="/#about">About Us</Link></li>
            <li><Link to="/#testimonials">Testimonials</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Services</h4>
          <ul>
            {SERVICE_CATALOG.slice(0, 6).map((s) => (
              <li key={s.id}>
                <Link to="/#services">{s.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <ul className="footer-contact">
            <li>
              <i className="fa-solid fa-envelope" />
              <a href="mailto:labourconnecthelpdesk@gmail.com">labourconnecthelpdesk@gmail.com</a>
            </li>
            <li>
              <i className="fa-solid fa-phone" />
              <a href="tel:+919010585312">+91 6281435138</a>
            </li>
            <li>
              <i className="fa-solid fa-location-dot" />
              <span>Hyderabad, Telangana, India</span>
            </li>
          </ul>
          <Link to="/helpdesk" className="footer-cta">
            Help Desk →
          </Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {year} Labour Connect. All rights reserved.</p>
        <div className="footer-bottom-links">
          <Link to="/helpdesk">Support</Link>
          <Link to="/login">Sign In</Link>
          <Link to="/register/client">Hire Workers</Link>
        </div>
      </div>
    </footer>
  );
}
