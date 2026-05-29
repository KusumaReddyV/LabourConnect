import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { clientAPI, notificationAPI } from '../../services/api';
import StatCard from '../../components/ui/StatCard';
import { CardSkeleton } from '../../components/ui/PageLoader';
import Button from '../../components/ui/Button';

export default function ClientOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([clientAPI.getJobs(), clientAPI.getFavourites(), notificationAPI.getAll()])
      .then(([jobs, favs, notifs]) => {
        const j = jobs.data;
        const norm = (s) =>
          ({ pending: 'open', ongoing: 'in_progress', work_finished: 'done', completed: 'done' }[s] || s);
        setStats({
          open: j.filter((x) => norm(x.status) === 'open').length,
          active: j.filter((x) => ['accepted', 'in_progress'].includes(norm(x.status))).length,
          done: j.filter((x) => norm(x.status) === 'done').length,
          favourites: favs.data.length,
          unread: notifs.data.filter((n) => !n.isRead).length,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="stats-grid">
        {[1, 2, 3, 4].map((i) => (
          <CardSkeleton key={i} lines={2} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="stats-grid">
        <StatCard label="Open Jobs" value={stats.open} icon="📋" />
        <StatCard label="Active" value={stats.active} icon="🔧" />
        <StatCard label="Done" value={stats.done} icon="✅" accent="gold" />
        <StatCard label="Favourites" value={stats.favourites} icon="♥" />
        <StatCard label="Notifications" value={stats.unread} icon="🔔" />
      </div>
      <div className="dashboard-panel">
        <h2>Quick actions</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 16 }}>
          <Link to="/#workers">
            <Button>Find Workers (Home)</Button>
          </Link>
          <Link to="/client/dashboard/jobs">
            <Button variant="secondary">Manage Jobs</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
