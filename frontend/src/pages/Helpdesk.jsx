import { useState } from 'react';
import { helpdeskAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';

export default function Helpdesk() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await helpdeskAPI.submit(form);
      showToast('Message received. We will respond soon!', 'success');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="card helpdesk-card">
        <h1>Help Desk</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Submitting…' : 'Submit'}
          </Button>
        </form>
      </div>
    </div>
  );
}
