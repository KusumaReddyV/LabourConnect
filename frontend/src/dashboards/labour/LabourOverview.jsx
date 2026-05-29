import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { labourAPI, notificationAPI } from '../../services/api';
import StatCard from '../../components/ui/StatCard';
import { CardSkeleton } from '../../components/ui/PageLoader';
import { formatCurrency, formatDate } from '../../utils/format';
import Button from '../../components/ui/Button';

export default function LabourOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      labourAPI.getProfile(),
      labourAPI.getJobRequests(),
      labourAPI.getEarnings(),
      notificationAPI.getAll(),
    ])
      .then(([prof, jobs, earnings, notifs]) => {
        const jobList = jobs.data;
        const norm = (s) =>
          ({ pending: 'open', ongoing: 'in_progress', work_finished: 'done', completed: 'done' }[s] ||
            s);
        setStats({
          profile: prof.data,
          open: jobList.filter((j) => norm(j.status) === 'open').length,
          active: jobList.filter((j) => ['accepted', 'in_progress'].includes(norm(j.status))).length,
          completed: earnings.data.completedJobsCount ?? prof.data.completedJobs ?? 0,
          earnings: earnings.data.totalEarnings ?? prof.data.totalEarnings ?? 0,
          earningsHistory: earnings.data.earningsHistory ?? [],
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
        <StatCard label="Rating" value={`${stats.profile.ratings}/5`} icon="⭐" />
        <StatCard label="Open Requests" value={stats.open} icon="📥" />
        <StatCard label="Active Jobs" value={stats.active} icon="🔧" />
        <StatCard label="Total Earnings" value={formatCurrency(stats.earnings)} icon="💰" accent="gold" />
        <StatCard label="Completed Jobs" value={stats.completed} icon="✅" />
        <StatCard label="Unread Alerts" value={stats.unread} icon="🔔" />
      </div>

      {stats.earningsHistory.length > 0 && (
        <div className="dashboard-panel mb-6">
          <h2 className="mb-4 mt-0 text-lg font-semibold text-gray-900">Recent earnings</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Amount</th>
                  <th>Completed</th>
                </tr>
              </thead>
              <tbody>
                {stats.earningsHistory.slice(0, 5).map((row) => (
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

      <div className="dashboard-panel">
        <h2 className="mb-4 mt-0 text-lg font-semibold text-gray-900">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/labour/dashboard/requests">
            <Button>View requests</Button>
          </Link>
          <Link to="/labour/dashboard/profile">
            <Button variant="secondary">Update profile</Button>
          </Link>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          Availability: <strong className="text-gray-700">{stats.profile.availability}</strong> ·{' '}
          {stats.profile.location}
        </p>
      </div>
    </>
  );
}
