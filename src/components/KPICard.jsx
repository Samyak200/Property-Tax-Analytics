
export default function KPICard({ label, value, hint, variant = 'total' }) {
  return (
    <article
      className={`kpi-card kpi-card--${variant}`}
      aria-label={label}
    >
      <p className="kpi-card__label">{label}</p>
      <p className="kpi-card__value">{value}</p>
      {hint ? <p className="kpi-card__hint">{hint}</p> : null}
    </article>
  );
}
