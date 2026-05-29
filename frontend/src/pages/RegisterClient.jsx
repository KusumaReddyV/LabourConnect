import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateEmail, validatePassword, validatePhone, validateRequired } from '../utils/validation';
import Button from '../components/ui/Button';

export default function RegisterClient() {
  const { registerClient } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    companyName: '',
    address: '',
    requiredServices: '',
  });

  const validate = () => {
    const next = {};
    next.fullName = validateRequired(form.fullName, 'Full name');
    next.email = validateEmail(form.email);
    next.password = validatePassword(form.password);
    next.phoneNumber = validatePhone(form.phoneNumber);
    Object.keys(next).forEach((k) => !next[k] && delete next[k]);
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await registerClient({ ...form, email: form.email.trim().toLowerCase() });
      showToast('Welcome to Labour Connect!', 'success');
      navigate('/');
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Client Registration</h2>
        <p style={{ textAlign: 'center', color: '#666', fontSize: 14 }}>
          Register to browse workers and send hiring requests
        </p>
        <form onSubmit={handleSubmit} noValidate>
          {['fullName', 'email', 'password', 'phoneNumber', 'companyName', 'address', 'requiredServices'].map(
            (field) => (
              <div key={field} className={`form-group ${errors[field] ? 'has-error' : ''}`}>
                <label>{field.replace(/([A-Z])/g, ' $1')}</label>
                <input
                  name={field}
                  type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                  value={form[field]}
                  onChange={(e) => {
                    setForm({ ...form, [field]: e.target.value });
                    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
                  }}
                  required={['fullName', 'email', 'password', 'phoneNumber'].includes(field)}
                  placeholder={field === 'email' ? 'you@gmail.com' : undefined}
                  pattern={field === 'phoneNumber' ? '[0-9]{10}' : undefined}
                  minLength={field === 'password' ? 6 : undefined}
                />
                {errors[field] && <p className="field-error">{errors[field]}</p>}
              </div>
            )
          )}
          <Button type="submit" loading={loading}>Register</Button>
        </form>
        <div className="auth-links">
          <Link to="/login" state={{ role: 'client' }}>Already have an account?</Link>
        </div>
      </div>
    </div>
  );
}
