import { useMemo } from 'react';
import { computeStatusBreakdown, filterByTenant } from '../utils/analytics';

const SEGMENT_STYLES = {
  approved: 'status-bar__segment--approved',
  rejected: 'status-bar__segment--rejected',
  pending: 'status-bar__segment--pending',
};

export default function StatusBreakdownBar({ records, selectedTenant }) {
  const segments = useMemo(() => {
    const filtered = filterByTenant(records, selectedTenant);
    return computeStatusBreakdown(filtered);
  }, [records, selectedTenant]);

  const total = segments.reduce((sum, segment) => sum + segment.count, 0);

  return (
    <section
      className="panel status-bar"
      aria-label="Property status breakdown"
    >
      <header className="panel__header status-bar__header">
        <h2>Status Distribution</h2>
        <p>
          {total.toLocaleString('en-IN')} properties — share by approval status
        </p>
      </header>

      <div
        className="status-bar__track"
        role="img"
        aria-label={segments
          .map((s) => `${s.label} ${s.percent.toFixed(1)}%`)
          .join(', ')}
      >
        {segments.map((segment) =>
          segment.percent > 0 ? (
            <div
              key={segment.key}
              className={`status-bar__segment ${SEGMENT_STYLES[segment.key]}`}
              style={{ width: `${segment.percent}%` }}
              title={`${segment.label}: ${segment.percent.toFixed(1)}%`}
            />
          ) : null,
        )}
      </div>

      <ul className="status-bar__legend">
        {segments.map((segment) => (
          <li key={segment.key} className="status-bar__legend-item">
            <span
              className={`status-bar__dot ${SEGMENT_STYLES[segment.key]}`}
              aria-hidden="true"
            />
            <span className="status-bar__legend-label">{segment.label}</span>
            <span className="status-bar__legend-value">
              {segment.count.toLocaleString('en-IN')} (
              {segment.percent.toFixed(1)}%)
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
