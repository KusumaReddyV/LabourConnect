import { useEffect, useState } from 'react';
import { labourAPI, jobsAPI } from '../../services/api';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { CardSkeleton } from '../../components/ui/PageLoader';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/format';

const isOpen = (status) => ['open', 'pending'].includes(status);

export default function LabourRequests() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const load = () => {
    setLoading(true);
    labourAPI
      .getJobRequests()
      .then(({ data }) => setJobs(data.filter((j) => isOpen(j.status))))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  const accept = async (id) => {
    try {
      await jobsAPI.accept(id);
      showToast('Job accepted', 'success');
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Action failed', 'error');
    }
  };

  const reject = async (id) => {
    try {
      await labourAPI.rejectJob(id);
      showToast('Job rejected', 'success');
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Action failed', 'error');
    }
  };

  if (loading) return <CardSkeleton lines={5} />;

  if (!jobs.length) {
    return (
      <div className="dashboard-panel">
        <EmptyState title="No open jobs" message="New job requests from clients will appear here." />
      </div>
    );
  }

  return (
    <div className="dashboard-panel">
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Worker Name</th>
              <th>Job Title</th>
              <th>Status</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id}>
                <td>{job.clientId?.userId?.name || '—'}</td>
                <td>—</td>
                <td>{job.title}</td>
                <td>
                  <Badge status="open">Open</Badge>
                </td>
                <td>{formatDate(job.createdAt)}</td>
                <td>
                  <div className="job-actions-cell">
                    <Button type="button" onClick={() => accept(job._id)}>
                      Accept Job
                    </Button>
                    <Button variant="outline" type="button" onClick={() => reject(job._id)}>
                      Reject
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
