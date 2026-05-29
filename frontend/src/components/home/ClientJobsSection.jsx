import { useEffect, useState } from 'react';
import { jobsAPI } from '../../services/api';
import JobCard from '../ui/JobCard';
import EmptyState from '../ui/EmptyState';
import { CardSkeleton } from '../ui/PageLoader';

const normalizeStatus = (status) => {
  const map = { pending: 'open', ongoing: 'in_progress', work_finished: 'done', completed: 'done' };
  return map[status] || status;
};

export default function ClientJobsSection() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobsAPI
      .getAll()
      .then(({ data }) => setJobs(data))
      .finally(() => setLoading(false));
  }, []);

  const active = jobs.filter((j) => ['open', 'accepted', 'in_progress'].includes(normalizeStatus(j.status)));

  return (
    <section className="section-block" id="jobs">
      <h2 className="section-title">Your Jobs</h2>
      <p className="section-subtitle">Track job status and message your worker after acceptance</p>

      {loading ? (
        <CardSkeleton lines={4} />
      ) : jobs.length === 0 ? (
        <EmptyState title="No jobs yet" message="Hire a worker from the section above." />
      ) : (
        active.slice(0, 4).map((job) => <JobCard key={job._id} job={job} role="client" />)
      )}
    </section>
  );
}
