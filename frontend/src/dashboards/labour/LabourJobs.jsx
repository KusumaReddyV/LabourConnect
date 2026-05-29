import { useEffect, useState } from 'react';
import { labourAPI, jobsAPI } from '../../services/api';
import JobTable from '../../components/jobs/JobTable';
import EmptyState from '../../components/ui/EmptyState';
import { CardSkeleton } from '../../components/ui/PageLoader';
import { useToast } from '../../context/ToastContext';

const normalizeStatus = (status) => {
  const map = { pending: 'open', ongoing: 'in_progress', work_finished: 'done', completed: 'done' };
  return map[status] || status;
};

export default function LabourJobs() {
  const [tab, setTab] = useState('active');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const load = () => {
    setLoading(true);
    labourAPI
      .getJobRequests()
      .then(({ data }) => setJobs(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  const filtered =
    tab === 'active'
      ? jobs.filter((j) => ['accepted', 'in_progress'].includes(normalizeStatus(j.status)))
      : jobs.filter((j) => normalizeStatus(j.status) === 'done');

  const handleAction = async (id, type) => {
    try {
      if (type === 'accept') await jobsAPI.accept(id);
      else if (type === 'start') await jobsAPI.start(id);
      else await jobsAPI.complete(id);
      const labels = {
        accept: 'Job accepted',
        start: 'Job started',
        complete: 'Job completed — earnings updated',
      };
      showToast(labels[type], 'success');
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Action failed', 'error');
    }
  };

  return (
    <div className="dashboard-panel">
      <div className="dashboard-tabs" style={{ marginBottom: 20 }}>
        {['active', 'done'].map((t) => (
          <button key={t} type="button" className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
            {t === 'active' ? 'Active' : 'Done'}
          </button>
        ))}
      </div>
      {loading ? (
        <CardSkeleton lines={5} />
      ) : !filtered.length ? (
        <EmptyState title={`No ${tab} jobs`} />
      ) : (
        <JobTable jobs={filtered} role="labour" onAction={handleAction} />
      )}
    </div>
  );
}
