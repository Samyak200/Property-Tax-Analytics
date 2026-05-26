import { useMemo } from 'react';
import KPICard from './KPICard';
import { computeKpis, filterByTenant, formatInr } from '../utils/analytics';

export default function KPIDashboard({ records, selectedTenant }) {
  const kpis = useMemo(() => {
    const filtered = filterByTenant(records, selectedTenant);
    return computeKpis(filtered);
  }, [records, selectedTenant]);

  return (
    <section className="kpi-dashboard" aria-label="Key performance indicators">
      <div className="kpi-grid">
        <KPICard
          variant="total"
          label="Total Properties Registered"
          value={kpis.totalRegistered.toLocaleString('en-IN')}
          hint="Count of all records for the selected tenant"
        />
        <KPICard
          variant="approved"
          label="Total Properties Approved"
          value={kpis.approved.toLocaleString('en-IN')}
          hint="Records where status is Approved"
        />
        <KPICard
          variant="rejected"
          label="Total Properties Rejected"
          value={kpis.rejected.toLocaleString('en-IN')}
          hint="Records where status is Rejected"
        />
        <KPICard
          variant="collection"
          label="Total Collection (Rs.)"
          value={formatInr(kpis.totalCollection)}
          hint="Sum of collection_inr for the selected tenant"
        />
      </div>
    </section>
  );
}
