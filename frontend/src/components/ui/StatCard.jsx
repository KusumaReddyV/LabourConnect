export default function StatCard({ label, value, icon, accent }) {
  return (
    <div className={`stat-card ${accent ? `stat-card-${accent}` : ''}`}>
      {icon && <span className="stat-card-icon" aria-hidden>{icon}</span>}
      <div>
        <p className="stat-card-label">{label}</p>
        <p className="stat-card-value">{value}</p>
      </div>
    </div>
  );
}
