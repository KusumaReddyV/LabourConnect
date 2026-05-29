import { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { CardSkeleton } from '../../components/ui/PageLoader';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const load = () => {
    setLoading(true);
    adminAPI
      .getUsers(filter || undefined)
      .then(({ data }) => setUsers(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), [filter]);

  const block = async (id, isBlocked) => {
    await adminAPI.blockUser(id, isBlocked);
    showToast(isBlocked ? 'User blocked' : 'User unblocked', 'success');
    load();
  };

  const del = async (id) => {
    if (!window.confirm('Delete permanently?')) return;
    await adminAPI.deleteUser(id);
    showToast('User deleted', 'success');
    load();
  };

  return (
    <div className="dashboard-panel">
      <div className="dashboard-tabs" style={{ marginBottom: 20 }}>
        {['', 'labour', 'client'].map((f) => (
          <button key={f || 'all'} type="button" className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>
            {f || 'All'}
          </button>
        ))}
      </div>
      {loading ? (
        <CardSkeleton lines={5} />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.isBlocked ? 'Blocked' : 'Active'}</td>
                  <td>
                    {u.role !== 'admin' && (
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <Button variant="outline" type="button" onClick={() => block(u._id, !u.isBlocked)}>
                          {u.isBlocked ? 'Unblock' : 'Block'}
                        </Button>
                        <Button variant="danger" type="button" onClick={() => del(u._id)}>
                          Delete
                        </Button>
                      </div>
                    )}
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
