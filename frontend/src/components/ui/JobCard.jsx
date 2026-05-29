import { Link } from 'react-router-dom';
import Badge from './Badge';
import Button from './Button';
import { formatCurrency, formatDate, getLabourName } from '../../utils/format';
import { JOB_STATUS_LABELS, PAYMENT_STATUS_LABELS } from '../../utils/constants';

const displayStatus = (status) => {
  const key = { pending: 'open', ongoing: 'in_progress', work_finished: 'done', completed: 'done' }[status] || status;
  return JOB_STATUS_LABELS[key] || JOB_STATUS_LABELS[status] || status;
};

const badgeStatus = (status) =>
  ({ pending: 'open', ongoing: 'in_progress', work_finished: 'done', completed: 'done' }[status] || status);

export default function JobCard({ job, role, onAction, actions, extra }) {
  const labour = job.labourId;
  const clientName = job.clientId?.userId?.name;

  return (
    <article className="card job-card">
      <div className="job-card-header">
        <h3>{job.title}</h3>
        <Badge status={badgeStatus(job.status)}>{displayStatus(job.status)}</Badge>
      </div>
      <p className="job-card-desc">{job.description}</p>
      <div className="job-card-meta">
        {role === 'client' && labour && (
          <span>
            <strong>Worker:</strong> {getLabourName(labour)} ({labour.category})
          </span>
        )}
        {role === 'labour' && clientName && (
          <span>
            <strong>Client:</strong> {clientName}
          </span>
        )}
        <span>
          <strong>Location:</strong> {job.location}
        </span>
        <span>
          <strong>Wage:</strong> {formatCurrency(job.wageOffered)}
        </span>
        <span>
          <strong>Date:</strong> {formatDate(job.date)} · {job.timing}
        </span>
        {(job.status === 'done' || job.status === 'completed') && job.paymentStatus && (
          <span>
            <strong>Payment:</strong> {PAYMENT_STATUS_LABELS[job.paymentStatus] || job.paymentStatus}
          </span>
        )}
      </div>
      {extra}
      {role === 'client' && labour?._id && (
        <Link to={`/labour/${labour._id}`} className="job-card-link">
          View worker profile →
        </Link>
      )}
      {actions && <div className="job-card-actions">{actions}</div>}
      {onAction && !actions && (
        <div className="job-card-actions">
          {onAction(job)}
        </div>
      )}
    </article>
  );
}
