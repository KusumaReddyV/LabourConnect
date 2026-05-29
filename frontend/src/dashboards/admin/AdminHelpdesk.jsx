import { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useToast } from '../../context/ToastContext';
import { CardSkeleton } from '../../components/ui/PageLoader';
import { formatDate } from '../../utils/format';
import { HELPDESK_STATUS_LABELS } from '../../utils/constants';
import EmptyState from '../../components/ui/EmptyState';

export default function AdminHelpdesk() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const load = () => {
    setLoading(true);
    adminAPI
      .getHelpdesk()
      .then(({ data }) => setTickets(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  const updateStatus = async (id, status) => {
    try {
      await adminAPI.updateHelpdeskStatus(id, status);
      const labels = {
        in_progress: 'Ticket marked in progress',
        done: 'Ticket marked as done',
        open: 'Ticket reopened',
      };
      showToast(labels[status] || 'Status updated', 'success');
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'error');
    }
  };

  return (
    <div className="dashboard-panel">
      {loading ? (
        <CardSkeleton lines={5} />
      ) : !tickets.length ? (
        <EmptyState title="No tickets" message="Helpdesk submissions will appear here." />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t._id}>
                  <td>{t.name}</td>
                  <td>{t.email}</td>
                  <td className="cell-message">{t.message}</td>
                  <td>
                    <Badge status={t.status}>{HELPDESK_STATUS_LABELS[t.status] || t.status}</Badge>
                  </td>
                  <td>{formatDate(t.createdAt)}</td>
                  <td>
                    <div className="job-actions-cell">
                      {t.status !== 'in_progress' && t.status !== 'done' && (
                        <Button type="button" variant="outline" onClick={() => updateStatus(t._id, 'in_progress')}>
                          Mark In Progress
                        </Button>
                      )}
                      {t.status !== 'done' && (
                        <Button type="button" onClick={() => updateStatus(t._id, 'done')}>
                          Mark as Done
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
