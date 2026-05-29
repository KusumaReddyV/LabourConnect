import { useEffect, useState } from 'react';
import { clientAPI } from '../../services/api';
import LabourCardModern from '../../components/ui/LabourCardModern';
import EmptyState from '../../components/ui/EmptyState';
import { CardSkeleton } from '../../components/ui/PageLoader';

export default function ClientFavourites() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    clientAPI.getFavourites().then(({ data }) => setList(data)).finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  if (loading) {
    return (
      <div className="dashboard-panel">
        <CardSkeleton lines={3} />
      </div>
    );
  }

  if (!list.length) {
    return (
      <div className="dashboard-panel">
        <EmptyState title="No favourites" message="Save workers from their profile page." icon="♥" />
      </div>
    );
  }

  return (
    <div className="dashboard-panel">
      <div className="favourites-grid">
        {list.map((l) => (
          <LabourCardModern key={l._id} labour={l} />
        ))}
      </div>
    </div>
  );
}
