import { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import JobTable from '../../components/jobs/JobTable';
import EmptyState from '../../components/ui/EmptyState';
import { CardSkeleton } from '../../components/ui/PageLoader';

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI
      .getJobs()
      .then(({ data }) => setJobs(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard-panel">
      {loading ? (
        <CardSkeleton lines={5} />
      ) : !jobs.length ? (
        <EmptyState title="No jobs" message="Jobs created by clients will appear here." />
      ) : (
        <JobTable jobs={jobs} role="admin" />
      )}
    </div>
  );
}
