import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { labourAPI } from '../../services/api';
import { LABOUR_CATEGORIES } from '../../utils/constants';
import LabourCardModern from '../ui/LabourCardModern';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import { CardSkeleton } from '../ui/PageLoader';

export default function WorkersSection() {
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    skill: '',
    minRating: '',
  });
  const [labourers, setLabourers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async (override = {}) => {
    setLoading(true);
    const params = { ...filters, ...override, limit: 12 };
    Object.keys(params).forEach((k) => !params[k] && delete params[k]);
    try {
      const { data } = await labourAPI.search(params);
      setLabourers(data.labourers);
    } catch {
      setLabourers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const onFilter = (e) => {
      const cat = e.detail;
      setFilters((f) => ({ ...f, category: cat }));
      load({ category: cat });
    };
    window.addEventListener('lc-filter-category', onFilter);
    return () => window.removeEventListener('lc-filter-category', onFilter);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="section-block alt-bg" id="workers">
      <div className="section-inner">
        <h2 className="section-title">Find Workers</h2>
        <p className="section-subtitle">Search, filter, and hire verified professionals — all in one place</p>

        <form
          className="workers-filter-bar"
          onSubmit={(e) => {
            e.preventDefault();
            load();
          }}
        >
          <div className="form-group">
            <label>Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All categories</option>
              {LABOUR_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              placeholder="e.g. Hyderabad"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Skill</label>
            <input
              value={filters.skill}
              onChange={(e) => setFilters({ ...filters, skill: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Min rating</label>
            <input
              type="number"
              min="1"
              max="5"
              step="0.5"
              value={filters.minRating}
              onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
            />
          </div>
          <Button type="submit" loading={loading}>Search</Button>
        </form>

        <div className="workers-grid">
          {loading ? (
            <>
              <CardSkeleton lines={4} />
              <CardSkeleton lines={4} />
            </>
          ) : labourers.length === 0 ? (
            <EmptyState title="No workers match your filters" message="Try another category or location." />
          ) : (
            labourers.map((l) => <LabourCardModern key={l._id} labour={l} />)
          )}
        </div>

        <div className="section-cta-row">
          <button type="button" className="btn btn-outline" onClick={() => scrollTo('jobs')}>
            View my jobs ↓
          </button>
          <Link to="/client/dashboard" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
            Open job dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}
