/** Consistent email lookup (no Gmail dot-stripping). */
export const normalizeEmail = (email) => (email ? String(email).trim().toLowerCase() : '');

/** Map legacy "worker" to "labour" for API and routing. */
export const normalizeRole = (role) => {
  if (!role) return role;
  const r = String(role).toLowerCase().trim();
  if (r === 'worker' || r === 'labour') return 'labour';
  if (r === 'client') return 'client';
  if (r === 'admin') return 'admin';
  return r;
};

export const roleDisplayName = (role) => {
  const r = normalizeRole(role);
  if (r === 'labour') return 'worker';
  if (r === 'client') return 'client';
  if (r === 'admin') return 'admin';
  return r;
};
