import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ServiceCard from '../components/home/ServiceCard';
import WorkersSection from '../components/home/WorkersSection';
import ClientJobsSection from '../components/home/ClientJobsSection';
import { SERVICE_CATALOG, TESTIMONIALS } from '../utils/constants';
import { renderStars } from '../utils/format';
import '../styles/home.css';

export default function ClientExperience() {
  const { user } = useAuth();

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, []);

  return (
    <div className="client-experience page-fade">
      <section className="home-hero client-hero">
        <div className="client-hero-text">
          <h1>Welcome, {user?.name?.split(' ')[0] || 'Client'}</h1>
          <p>Hire verified workers, track jobs, and verify completion — all in one smooth experience.</p>
          <div className="home-cta-row">
            <a href="#workers" className="hero-button">Find Workers</a>
            <a href="#jobs" className="btn btn-outline hero-secondary-btn">My Jobs</a>
            <Link to="/client/dashboard" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
              Dashboard
            </Link>
          </div>
        </div>
      </section>

      <section className="section-block" id="services">
        <h2 className="section-title">Services</h2>
        <p className="section-subtitle">Browse by trade — workers appear below when you search</p>
        <div className="services-grid">
          {SERVICE_CATALOG.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      </section>

      <WorkersSection />

      <ClientJobsSection />

      <section className="section-block alt-bg" id="testimonials">
        <div className="section-inner">
          <h2 className="section-title">Trusted by Clients</h2>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <article key={t.name} className="testimonial-card">
                <div className="testimonial-stars">{renderStars(t.rating)}</div>
                <p>&ldquo;{t.text}&rdquo;</p>
                <div className="testimonial-author">{t.name}</div>
                <div className="testimonial-location">{t.location}</div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
