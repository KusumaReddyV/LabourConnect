import { useAuth } from '../../context/AuthContext';

export default function ServiceCard({ service, onSelect }) {
  const { isAuthenticated, user } = useAuth();

  const handleClick = () => {
    if (onSelect) {
      onSelect(service.category);
      return;
    }
    if (isAuthenticated && user?.role === 'client') {
      const el = document.getElementById('workers');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.dispatchEvent(new CustomEvent('lc-filter-category', { detail: service.category }));
      }
    }
  };

  return (
    <article className="service-card service-card-modern">
      <div className="service-card-image-wrap">
        <img src={service.image} alt={service.title} loading="lazy" />
        <span className="service-card-overlay-label">{service.title}</span>
      </div>
      <div className="service-card-body">
        <h3>{service.title}</h3>
        <p>{service.blurb}</p>
        <button type="button" className="btn btn-secondary service-card-btn" onClick={handleClick}>
          {isAuthenticated && user?.role === 'client' ? 'View Workers' : 'Explore'}
        </button>
      </div>
    </article>
  );
}
