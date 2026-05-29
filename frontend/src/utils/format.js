export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

export const renderStars = (rating) => {
  const r = Math.round(Number(rating) || 0);
  return '★'.repeat(r) + '☆'.repeat(5 - r);
};

export const getLabourName = (labour) => labour?.userId?.name || 'Worker';
