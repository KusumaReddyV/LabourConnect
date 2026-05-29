import { Fragment, useState } from 'react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatDate, getLabourName } from '../../utils/format';
import { JOB_STATUS_LABELS } from '../../utils/constants';
import JobMessageThread from './JobMessageThread';

const normalizeStatus = (status) => {
  const map = {
    pending: 'open',
    ongoing: 'in_progress',
    work_finished: 'done',
    completed: 'done',
  };
  return map[status] || status;
};

export default function JobTable({ jobs, role, onAction }) {
  const [expandedId, setExpandedId] = useState(null);

  const clientName = (job) => job.clientId?.userId?.name || '—';
  const canMessage = (job) => ['accepted', 'in_progress', 'done'].includes(normalizeStatus(job.status));

  const renderWorkerActions = (job) => {
    const status = normalizeStatus(job.status);
    const actions = [];
    if (status === 'open') {
      actions.push(
        <Button key="accept" type="button" onClick={() => onAction(job._id, 'accept')}>
          Accept Job
        </Button>
      );
    }
    if (status === 'accepted') {
      actions.push(
        <Button key="start" type="button" onClick={() => onAction(job._id, 'start')}>
          Start Job
        </Button>
      );
    }
    if (status === 'in_progress') {
      actions.push(
        <Button key="complete" type="button" onClick={() => onAction(job._id, 'complete')}>
          Mark as Done
        </Button>
      );
    }
    return actions;
  };

  return (
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
          {jobs.map((job) => {
            const status = normalizeStatus(job.status);
            const isExpanded = expandedId === job._id;
            return (
              <Fragment key={job._id}>
                <tr>
                  <td>{clientName(job)}</td>
                  <td>{getLabourName(job.labourId)}</td>
                  <td>{job.title}</td>
                  <td>
                    <Badge status={status}>{JOB_STATUS_LABELS[status] || status}</Badge>
                  </td>
                  <td>{formatDate(job.createdAt)}</td>
                  <td>
                    <div className="job-actions-cell">
                      {role === 'labour' && onAction && renderWorkerActions(job)}
                      {role !== 'admin' && canMessage(job) && (
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : job._id)}
                        >
                          {isExpanded ? 'Hide' : 'Messages'}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
                {isExpanded && (
                  <tr>
                    <td colSpan={6} className="job-table-expand">
                      <JobMessageThread jobId={job._id} canMessage={role !== 'admin'} />
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
