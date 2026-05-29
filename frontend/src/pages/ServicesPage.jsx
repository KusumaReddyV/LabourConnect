import ServiceCard from '../components/home/ServiceCard';
import { SERVICE_CATALOG } from '../utils/constants';
import '../styles/home.css';

export default function ServicesPage() {
  return (
    <div className="services-page-public">
      <section className="section-block" style={{ paddingTop: 32 }}>
        <h1 className="section-title">Our Services</h1>
        <p className="section-subtitle">
          Professional help across trades. Sign in as a client to view worker profiles and hire.
        </p>
        <div className="services-grid page-container">
          {SERVICE_CATALOG.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>
    </div>
  );
}
