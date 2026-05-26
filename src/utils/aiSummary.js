import { TENANTS } from '../constants/tenants';

export function buildDatasetSummary(records) {
  const perCity = Object.fromEntries(
    TENANTS.map((city) => [
      city,
      { total: 0, Approved: 0, Rejected: 0, Pending: 0, collection: 0 },
    ]),
  );

  for (const record of records) {
    const bucket = perCity[record.tenant];
    if (!bucket) continue;

    bucket.total += 1;
    if (bucket[record.status] !== undefined) {
      bucket[record.status] += 1;
    }
    bucket.collection += record.collection_inr ?? 0;
  }

  const totals = {
    total: records.length,
    Approved: 0,
    Rejected: 0,
    Pending: 0,
    collection: 0,
  };

  for (const city of TENANTS) {
    totals.Approved += perCity[city].Approved;
    totals.Rejected += perCity[city].Rejected;
    totals.Pending += perCity[city].Pending;
    totals.collection += perCity[city].collection;
  }

  const topCollector = TENANTS.reduce(
    (best, city) =>
      perCity[city].collection > perCity[best].collection ? city : best,
    TENANTS[0],
  );

  return {
    tenants: TENANTS,
    totals,
    perCity,
    insights: {
      topCollectorCity: topCollector,
    },
  };
}

