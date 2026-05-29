import { Link } from 'react-router-dom';
import ServiceCard from '../components/home/ServiceCard';
import { SERVICE_CATALOG, TESTIMONIALS } from '../utils/constants';
import { renderStars } from '../utils/format';
import '../styles/home.css';

export default function PublicHome() {
  return (
    <div className="page-fade">
      <section className="home-hero" id="top">
        <img
          src="https://i.postimg.cc/SK179nbc/dlwf1rhq.png"
          alt="Labour Connect"
        />
        <h1>Labour Connect</h1>
        <p>
          India&apos;s trusted platform for skilled labour — explore services, sign in to hire verified
          workers, and manage jobs professionally.
        </p>
        <div className="home-cta-row">
          <Link to="/login" className="hero-button">
            Sign In to Hire
          </Link>
          <Link to="/start" className="btn btn-outline hero-secondary-btn">
            Get Started
          </Link>
        </div>
      </section>

      <section className="section-block" id="services">
        <h2 className="section-title">Our Services</h2>
        <p className="section-subtitle">
          Professional help across trades. Sign in as a client to view workers and hire.
        </p>
        <div className="services-grid">
          {SERVICE_CATALOG.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      <section className="section-block alt-bg" id="about">
        <div className="section-inner">
          <h2 className="section-title">About Labour Connect</h2>
          <div className="about-grid">
            <div className="about-card">
              <h3>For Clients</h3>
              <p>Register, browse workers, send hiring requests, verify completion, and rate professionals.</p>
            </div>
            <div className="about-card">
              <h3>For Workers</h3>
              <p>Build your profile, accept jobs, mark work finished, and grow ratings with every completed job.</p>
            </div>
            <div className="about-card">
              <h3>Why Us</h3>
              <p>Transparent wages, verified workflow, and dashboards built for real Indian homes and sites.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block" id="testimonials">
        <h2 className="section-title">What Clients Say</h2>
        <div className="testimonials-grid page-container">
          {TESTIMONIALS.map((t) => (
            <article key={t.name} className="testimonial-card">
              <div className="testimonial-stars">{renderStars(t.rating)}</div>
              <p>&ldquo;{t.text}&rdquo;</p>
              <div className="testimonial-author">{t.name}</div>
              <div className="testimonial-location">{t.location}</div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
