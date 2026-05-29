import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { labourAPI, clientAPI, getImageUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import HireModal from '../components/common/HireModal';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { CardSkeleton } from '../components/ui/PageLoader';
import EmptyState from '../components/ui/EmptyState';
import { renderStars, formatCurrency } from '../utils/format';
import { SERVICE_CATALOG } from '../utils/constants';

export default function LabourProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [labour, setLabour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showHire, setShowHire] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    labourAPI
      .getPublic(id)
      .then(({ data }) => setLabour(data))
      .catch((err) => {
        if (err.response?.status === 401) setError('auth');
        else setError('Profile not found');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="page-container">
        <CardSkeleton lines={6} />
      </div>
    );
  }

  if (error || !labour) {
    return (
      <div className="page-container">
        <EmptyState
          title={error === 'auth' ? 'Sign in required' : 'Worker not found'}
          action={<Link to="/login">Sign in</Link>}
        />
      </div>
    );
  }

  const name = labour.userId?.name || 'Worker';
  const categoryImg =
    labour.categoryImage || SERVICE_CATALOG.find((s) => s.category === labour.category)?.image;
  const reviews = labour.reviews || [];
  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <div className="page-container labour-profile-page">
      <Link to="/#workers" className="back-link">← Back to workers</Link>

      {categoryImg && (
        <div className="profile-category-banner">
          <img src={categoryImg} alt={labour.category} />
          <span className="profile-category-label">{labour.category}</span>
        </div>
      )}

      <div className="profile-layout">
        <div className="profile-main">
          <div className="profile-page-hero profile-page-hero-inner">
            {labour.profileImage ? (
              <img src={getImageUrl(labour.profileImage)} alt={name} className="profile-page-avatar" />
            ) : (
              <div className="profile-page-avatar labour-card-avatar-placeholder">{name.charAt(0)}</div>
            )}
            <div className="profile-page-details">
              <h1>{name}</h1>
              <Badge status={labour.availability}>{labour.availability}</Badge>
              <p className="rating-stars profile-rating">
                {renderStars(labour.ratings)} <strong>{labour.ratings}</strong>/5 ({labour.ratingCount}{' '}
                reviews)
              </p>
              <ul className="profile-facts">
                <li><strong>Experience:</strong> {labour.experience} years</li>
                <li><strong>Completed jobs:</strong> {labour.completedJobsCount ?? labour.completedJobs}</li>
                <li><strong>Location:</strong> {labour.location}</li>
                <li><strong>Wage:</strong> {formatCurrency(labour.wagePerDay)} / day</li>
              </ul>
              {labour.skills?.length > 0 && (
                <div className="skill-tags">
                  {labour.skills.map((s) => (
                    <span key={s} className="skill-tag">{s}</span>
                  ))}
                </div>
              )}
              <p className="profile-description">{labour.description}</p>
            </div>
          </div>

          <div className="card">
            <h2>Ratings breakdown</h2>
            <div className="rating-breakdown">
              {ratingBreakdown.map(({ star, count }) => (
                <div key={star} className="chart-bar-row">
                  <span>{star} ★</span>
                  <div className="chart-bar-track">
                    <div
                      className="chart-bar-fill"
                      style={{
                        width: `${reviews.length ? (count / reviews.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span>{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card profile-reviews-section">
            <h2>Client reviews</h2>
            {!reviews.length ? (
              <EmptyState title="No reviews yet" icon="💬" />
            ) : (
              reviews.map((r) => (
                <div key={r._id} className="review-row">
                  <strong>{r.clientId?.userId?.name || 'Client'}</strong>
                  <span className="rating-stars">{renderStars(r.rating)}</span>
                  <p>{r.review}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <aside className="profile-sticky-panel">
          <div className="sticky-hire-card card">
            <p className="sticky-price">{formatCurrency(labour.wagePerDay)}<span>/day</span></p>
            <p style={{ color: '#666', fontSize: 14 }}>{labour.category} · {labour.location}</p>
            {user?.role === 'client' && (
              <>
                <Button onClick={() => setShowHire(true)} className="btn-block">
                  Hire Now
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="btn-block"
                  onClick={async () => {
                    try {
                      await clientAPI.toggleFavourite(id);
                      showToast('Favourites updated', 'success');
                    } catch {
                      showToast('Could not update favourites', 'error');
                    }
                  }}
                >
                  ♥ Save to favourites
                </Button>
              </>
            )}
            <Link to="/#workers" className="btn btn-secondary btn-block" style={{ textDecoration: 'none', textAlign: 'center' }}>
              Browse more workers
            </Link>
          </div>
        </aside>
      </div>

      {showHire && <HireModal labourId={labour._id} labourName={name} onClose={() => setShowHire(false)} />}
    </div>
  );
}
