import { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import StatCard from '../../components/ui/StatCard';
import { CardSkeleton } from '../../components/ui/PageLoader';

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getAnalytics().then(({ data }) => setData(data)).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="stats-grid">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <CardSkeleton key={i} lines={2} />
        ))}
      </div>
    );
  }

  const maxCount = Math.max(...(data.jobsByStatus?.map((j) => j.count) || [1]), 1);

  return (
    <>
      <div className="stats-grid">
        <StatCard label="Total Users" value={data.totalUsers} icon="👥" />
        <StatCard label="Labour" value={data.totalLabour} icon="🔧" />
        <StatCard label="Clients" value={data.totalClients} icon="🏢" />
        <StatCard label="Total Jobs" value={data.totalJobs} icon="📋" />
        <StatCard label="Pending Jobs" value={data.pendingJobs} icon="⏳" />
        <StatCard label="Completed Jobs" value={data.completedJobs} icon="✅" />
        <StatCard label="Reviews" value={data.totalReviews} icon="⭐" accent="gold" />
      </div>

      <div className="dashboard-panel">
        <h2 style={{ marginTop: 0, color: '#864000' }}>Jobs by status</h2>
        <div className="chart-bars">
          {(data.jobsByStatus || []).map((item) => (
            <div key={item._id} className="chart-bar-row">
              <span>{item._id}</span>
              <div className="chart-bar-track">
                <div
                  className="chart-bar-fill"
                  style={{ width: `${(item.count / maxCount) * 100}%` }}
                />
              </div>
              <strong>{item.count}</strong>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
