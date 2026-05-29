import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LABOUR_CATEGORIES } from '../utils/constants';
import { validateEmail, validatePassword, validatePhone, validateRequired } from '../utils/validation';
import Button from '../components/ui/Button';

export default function RegisterLabour() {
  const { registerLabour } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    skills: '',
    category: '',
    experience: '',
    wagePerDay: '',
    location: '',
    description: '',
    availability: 'Available',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [aadhaarImage, setAadhaarImage] = useState(null);

  const validate = () => {
    const next = {};
    next.fullName = validateRequired(form.fullName, 'Full name');
    next.email = validateEmail(form.email);
    next.password = validatePassword(form.password);
    next.phoneNumber = validatePhone(form.phoneNumber);
    next.category = validateRequired(form.category, 'Category');
    next.location = validateRequired(form.location, 'Location');
    Object.keys(next).forEach((k) => !next[k] && delete next[k]);
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.set('email', form.email.trim().toLowerCase());
      if (profileImage) {
        if (!profileImage.type.startsWith('image/')) {
          showToast('Profile file must be an image', 'error');
          setLoading(false);
          return;
        }
        fd.append('profileImage', profileImage);
      }
      if (aadhaarImage) {
        if (!aadhaarImage.type.startsWith('image/')) {
          showToast('ID file must be an image', 'error');
          setLoading(false);
          return;
        }
        fd.append('aadhaarImage', aadhaarImage);
      }
      await registerLabour(fd);
      showToast('Registration successful!', 'success');
      navigate('/labour/dashboard');
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const field = (name, label, type = 'text', extra = {}) => (
    <div key={name} className={`form-group ${errors[name] ? 'has-error' : ''}`}>
      <label>{label}</label>
      <input
        name={name}
        type={type}
        value={form[name]}
        onChange={(e) => {
          setForm({ ...form, [name]: e.target.value });
          if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
        }}
        {...extra}
      />
      {errors[name] && <p className="field-error">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="auth-page">
      <div className="auth-container wide">
        <h2>Labour Registration</h2>
        <p style={{ textAlign: 'center', color: '#666', fontSize: 14 }}>
          Use a valid email (e.g. yourname@gmail.com)
        </p>
        <form onSubmit={handleSubmit} noValidate>
          {field('fullName', 'Full Name')}
          {field('email', 'Email', 'email', { placeholder: 'worker@gmail.com', autoComplete: 'email' })}
          {field('password', 'Password', 'password', { minLength: 6, autoComplete: 'new-password' })}
          {field('phoneNumber', 'Phone (10 digits)', 'tel', { pattern: '[0-9]{10}' })}
          <div className={`form-group ${errors.category ? 'has-error' : ''}`}>
            <label>Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Select</option>
              {LABOUR_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.category && <p className="field-error">{errors.category}</p>}
          </div>
          {field('skills', 'Skills (comma separated)')}
          {field('experience', 'Experience (years)', 'number', { min: 0 })}
          {field('wagePerDay', 'Wage per day (₹)', 'number', { min: 0 })}
          {field('location', 'Location')}
          <div className="form-group">
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Availability</label>
            <select value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })}>
              <option>Available</option>
              <option>Full-Time</option>
              <option>Part-Time</option>
              <option>Temporary</option>
            </select>
          </div>
          <div className="form-group">
            <label>Profile Image</label>
            <input type="file" accept="image/*" onChange={(e) => setProfileImage(e.target.files?.[0] || null)} />
          </div>
          <div className="form-group">
            <label>Aadhaar / ID</label>
            <input type="file" accept="image/*" onChange={(e) => setAadhaarImage(e.target.files?.[0] || null)} />
          </div>
          <Button type="submit" loading={loading}>Register</Button>
        </form>
        <div className="auth-links">
          <Link to="/login" state={{ role: 'labour' }}>Already have an account?</Link>
        </div>
      </div>
    </div>
  );
}
