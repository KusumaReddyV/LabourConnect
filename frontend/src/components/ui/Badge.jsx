const statusColors = {
  open: 'badge-open',
  accepted: 'badge-accepted',
  in_progress: 'badge-in-progress',
  done: 'badge-done',
  rejected: 'badge-rejected',
  pending: 'badge-open',
  ongoing: 'badge-in-progress',
  work_finished: 'badge-done',
  completed: 'badge-done',
  Available: 'badge-available',
  Busy: 'badge-busy',
};

export default function Badge({ children, variant, status }) {
  const cls = status ? statusColors[status] || 'badge-default' : variant || 'badge-default';
  return <span className={`badge ${cls}`}>{children}</span>;
}
