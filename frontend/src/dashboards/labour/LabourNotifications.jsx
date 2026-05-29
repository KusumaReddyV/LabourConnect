import { useEffect, useState } from 'react';
import { notificationAPI } from '../../services/api';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';
import { CardSkeleton } from '../../components/ui/PageLoader';

export default function LabourNotifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    notificationAPI.getAll().then(({ data }) => setItems(data)).finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  const markAll = async () => {
    await notificationAPI.markAllRead();
    load();
  };

  if (loading) return <CardSkeleton lines={4} />;

  return (
    <div className="dashboard-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Notifications</h2>
        {items.some((n) => !n.isRead) && (
          <Button variant="outline" type="button" onClick={markAll}>Mark all read</Button>
        )}
      </div>
      {!items.length ? (
        <EmptyState title="No notifications" icon="🔔" />
      ) : (
        items.map((n) => (
          <div
            key={n._id}
            className="notification-item"
            style={{
              padding: '14px 0',
              borderBottom: '1px solid #eee',
              opacity: n.isRead ? 0.65 : 1,
            }}
          >
            <strong>{n.title}</strong>
            <p style={{ margin: '6px 0 0', color: '#555' }}>{n.message}</p>
            <small style={{ color: '#999' }}>{new Date(n.createdAt).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
}
