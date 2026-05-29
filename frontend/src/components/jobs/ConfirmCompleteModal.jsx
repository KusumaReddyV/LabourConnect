import { useState } from 'react';
import { clientAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';

export default function ConfirmCompleteModal({ job, onClose, onSuccess }) {
  const { showToast } = useToast();
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('paid');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await clientAPI.confirmComplete(job._id, { rating, review, paymentStatus });
      showToast('Job completed. Worker profile updated!', 'success');
      onSuccess?.();
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to confirm', 'error');
    } finally {
      setLoading(false);
    }
  };

  const workerName = job.labourId?.userId?.name || 'Worker';

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal>
      <div className="modal-content card fade-in" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ color: 'var(--color-primary)', marginTop: 0 }}>Verify completion</h2>
        <p style={{ color: '#555' }}>
          <strong>{workerName}</strong> marked &ldquo;{job.title}&rdquo; as finished. Confirm the work
          and leave a rating.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Rating</label>
            <div className="rating-picker">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`rating-star-btn ${rating >= n ? 'active' : ''}`}
                  onClick={() => setRating(n)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Review (optional)</label>
            <textarea value={review} onChange={(e) => setReview(e.target.value)} rows={3} />
          </div>
          <div className="form-group">
            <label>Payment status</label>
            <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
              <option value="paid">Paid</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Button type="submit" loading={loading}>Confirm & Complete</Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
