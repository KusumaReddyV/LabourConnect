import { useEffect, useState } from 'react';
import { jobsAPI } from '../../services/api';
import JobTable from '../../components/jobs/JobTable';
import EmptyState from '../../components/ui/EmptyState';
import { CardSkeleton } from '../../components/ui/PageLoader';

const normalizeStatus = (status) => {
  const map = { pending: 'open', ongoing: 'in_progress', work_finished: 'done', completed: 'done' };
  return map[status] || status;
};

export default function ClientJobs() {
  const [tab, setTab] = useState('all');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    jobsAPI
      .getAll()
      .then(({ data }) => setJobs(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  const filtered =
    tab === 'all'
      ? jobs
      : tab === 'open'
        ? jobs.filter((j) => normalizeStatus(j.status) === 'open')
        : tab === 'active'
          ? jobs.filter((j) => ['accepted', 'in_progress'].includes(normalizeStatus(j.status)))
          : jobs.filter((j) => normalizeStatus(j.status) === 'done');

  return (
    <div className="dashboard-panel">
      <div className="dashboard-tabs" style={{ marginBottom: 20 }}>
        {[
          { id: 'all', label: 'All' },
          { id: 'open', label: 'Open' },
          { id: 'active', label: 'Active' },
          { id: 'done', label: 'Done' },
        ].map((t) => (
          <button key={t.id} type="button" className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      {loading ? (
        <CardSkeleton lines={5} />
      ) : !filtered.length ? (
        <EmptyState title={`No ${tab} jobs`} message="Hire a worker to create your first job." />
      ) : (
        <JobTable jobs={filtered} role="client" />
      )}
    </div>
  );
}
