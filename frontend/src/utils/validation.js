const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^[6-9][0-9]{9}$/;

export function validateEmail(email) {
  const value = (email || '').trim();
  if (!value) return 'Email is required';
  if (value.includes(' ')) return 'Email cannot contain spaces';
  if (!value.includes('@')) return 'Email must include @ (e.g. worker@gmail.com)';
  if (value.endsWith('@') || value.startsWith('@')) return 'Enter a complete email address';
  const [local, domain] = value.split('@');
  if (!local || !domain) return 'Invalid email format';
  if (!domain.includes('.')) return 'Email must include domain like gmail.com';
  if (domain.endsWith('.') || domain.startsWith('.')) return 'Invalid domain in email';
  const tld = domain.split('.').pop();
  if (!tld || tld.length < 2) return 'Invalid email domain';
  if (!EMAIL_REGEX.test(value)) return 'Enter a valid email (e.g. name@gmail.com)';
  return '';
}

export function validatePassword(password) {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  if (!/[A-Za-z]/.test(password)) return 'Password must contain at least one letter';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
  return '';
}

export function validatePhone(phone) {
  const value = (phone || '').trim();
  if (!value) return 'Phone number is required';
  if (!PHONE_REGEX.test(value)) return 'Enter a valid 10-digit Indian mobile number';
  return '';
}

export function validateRequired(value, label) {
  if (!value || !String(value).trim()) return `${label} is required`;
  return '';
}
