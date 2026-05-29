import { useEffect, useState } from 'react';
import { labourAPI, getImageUrl } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/format';
import { LABOUR_CATEGORIES, AVAILABILITY_OPTIONS } from '../../utils/constants';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/ui/Button';
import { CardSkeleton } from '../../components/ui/PageLoader';

export default function LabourProfileEdit() {
  const { showToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null);
  const [earnings, setEarnings] = useState(null);

  const load = () => {
    Promise.all([labourAPI.getProfile(), labourAPI.getEarnings()]).then(([prof, earn]) => {
      const data = prof.data;
      setProfile(data);
      setEarnings(earn.data);
      setForm({
        phoneNumber: data.phoneNumber || '',
        category: data.category || '',
        experience: data.experience ?? '',
        wagePerDay: data.wagePerDay ?? '',
        location: data.location || '',
        description: data.description || '',
        availability: data.availability || 'Available',
        skills: (data.skills || []).join(', '),
      });
      setLoading(false);
    });
  };

  useEffect(() => load(), []);

  const setAvailability = async (availability) => {
    const fd = new FormData();
    fd.append('availability', availability);
    try {
      const { data } = await labourAPI.updateProfile(fd);
      setProfile(data);
      setForm((f) => ({ ...f, availability }));
      showToast('Availability updated', 'success');
    } catch {
      showToast('Failed to update availability', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    const file = e.target.profileImage?.files?.[0];
    if (file) fd.append('profileImage', file);
    try {
      const { data } = await labourAPI.updateProfile(fd);
      setProfile(data);
      showToast('Profile saved successfully', 'success');
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <CardSkeleton lines={6} />;

  const imgSrc = preview || (profile?.profileImage ? getImageUrl(profile.profileImage) : null);

  return (
    <div className="dashboard-panel">
      <div className="profile-header-card">
        {imgSrc ? (
          <img src={imgSrc} alt="" className="profile-avatar-lg" />
        ) : (
          <div className="profile-avatar-lg labour-card-avatar-placeholder" style={{ width: 120, height: 120 }}>
            {profile?.userId?.name?.charAt(0)}
          </div>
        )}
        <div>
          <h2 className="m-0 text-lg font-semibold text-gray-900">{profile?.userId?.name}</h2>
          <p className="text-sm text-gray-600">
            {profile?.category} · {profile?.location}
          </p>
          <p className="mt-2 text-base font-semibold text-gray-900">
            Total Earnings: {formatCurrency(earnings?.totalEarnings ?? profile?.totalEarnings ?? 0)}
          </p>
          <p className="text-sm text-gray-500">
            {earnings?.completedJobsCount ?? profile?.completedJobs ?? 0} completed jobs
          </p>
          <div className="availability-toggle">
            {AVAILABILITY_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                className={form.availability === opt ? 'active' : ''}
                onClick={() => setAvailability(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {earnings?.earningsHistory?.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 text-base font-semibold text-gray-900">Earnings history</h3>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {earnings.earningsHistory.map((row) => (
                  <tr key={row.jobId?.toString() || row.completedAt}>
                    <td>{row.title}</td>
                    <td>{formatCurrency(row.amount)}</td>
                    <td>{formatDate(row.completedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {['phoneNumber', 'location', 'experience', 'wagePerDay'].map((field) => (
            <div key={field} className="form-group">
              <label>{field.replace(/([A-Z])/g, ' $1')}</label>
              <input
                name={field}
                type={field.includes('wage') || field === 'experience' ? 'number' : 'text'}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              />
            </div>
          ))}
          <div className="form-group">
            <label>Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {LABOUR_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Skills (comma separated)</label>
          <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
        </div>
        <div className="form-group">
          <label>Profile photo</label>
          <input
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setPreview(URL.createObjectURL(f));
            }}
          />
        </div>
        <Button type="submit" loading={saving}>Save changes</Button>
      </form>
    </div>
  );
}
