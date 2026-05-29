import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

export default function Account() {
  const { user, dashboardPath } = useAuth();
  return (
    <div className="page-container">
      <div className="card account-card">
        <h1>My Account</h1>
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
        <Link to={dashboardPath}>
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
