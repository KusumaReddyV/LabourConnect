import { Link } from 'react-router-dom';
import { getImageUrl } from '../../services/api';
import { renderStars, formatCurrency } from '../../utils/format';
import Badge from './Badge';
import Button from './Button';

export default function LabourCardModern({ labour, onHire }) {
  const name = labour.userId?.name || 'Worker';

  return (
    <article className="worker-card-modern">
      <div className="worker-card-image">
        {labour.profileImage ? (
          <img src={getImageUrl(labour.profileImage)} alt="" loading="lazy" />
        ) : (
          <span className="worker-card-initial">{name.charAt(0)}</span>
        )}
        <span className="worker-card-category">{labour.category}</span>
      </div>
      <div className="worker-card-content">
        <h3>{name}</h3>
        <p className="worker-card-rating">
          <span className="rating-stars">{renderStars(labour.ratings)}</span>
          <span>{labour.ratings}/5 ({labour.ratingCount || 0})</span>
        </p>
        <ul className="worker-card-meta">
          <li>{labour.experience} yrs exp</li>
          <li>{labour.location}</li>
          <li>{formatCurrency(labour.wagePerDay)}/day</li>
        </ul>
        <Badge status={labour.availability}>{labour.availability}</Badge>
        <div className="worker-card-actions">
          <Link to={`/labour/${labour._id}`}>
            <Button variant="outline" type="button">View Profile</Button>
          </Link>
          {onHire ? (
            <Button type="button" onClick={() => onHire(labour)}>Hire Now</Button>
          ) : (
            <Link to={`/labour/${labour._id}`}>
              <Button type="button">Hire Now</Button>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
