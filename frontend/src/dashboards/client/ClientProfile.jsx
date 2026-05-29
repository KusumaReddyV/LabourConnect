import { useEffect, useState } from 'react';
import { clientAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/ui/Button';
import { CardSkeleton } from '../../components/ui/PageLoader';

export default function ClientProfile() {
  const { showToast } = useToast();
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    clientAPI.getProfile().then(({ data }) => {
      setForm({
        phoneNumber: data.phoneNumber || '',
        companyName: data.companyName || '',
        address: data.address || '',
        requiredServices: (data.requiredServices || []).join(', '),
      });
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await clientAPI.updateProfile(form);
      showToast('Profile updated', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <CardSkeleton lines={5} />;

  return (
    <form className="dashboard-panel" onSubmit={handleSubmit}>
      <h2 style={{ marginTop: 0, color: '#864000' }}>Profile settings</h2>
      {['phoneNumber', 'companyName', 'address', 'requiredServices'].map((field) => (
        <div key={field} className="form-group">
          <label>{field.replace(/([A-Z])/g, ' $1')}</label>
          <input
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          />
        </div>
      ))}
      <Button type="submit" loading={saving}>Save profile</Button>
    </form>
  );
}
