import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';

export default function HireModal({ labourId, labourName, onClose }) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    wageOffered: '',
    date: '',
    timing: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await clientAPI.hire({ labourId, ...form, wageOffered: Number(form.wageOffered) });
      showToast('Booking request sent!', 'success');
      onClose();
      navigate('/#jobs');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to send request', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal>
      <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ color: '#864000', marginTop: 0 }}>Hire {labourName}</h2>
        <form onSubmit={handleSubmit}>
          {['title', 'location', 'timing'].map((field) => (
            <div key={field} className="form-group">
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                required
              />
            </div>
          ))}
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Wage offered (₹)</label>
            <input
              type="number"
              value={form.wageOffered}
              onChange={(e) => setForm({ ...form, wageOffered: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Button type="submit" loading={loading}>Send Request</Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
