import { ALL_TENANTS, TENANTS } from '../constants/tenants';

/**
 * @typedef {Object} PropertyRecord
 * @property {string} tenant
 * @property {string} status
 * @property {number} collection_inr
 */

/**
 * @typedef {Object} KpiMetrics
 * @property {number} totalRegistered
 * @property {number} approved
 * @property {number} rejected
 * @property {number} totalCollection
 */

/**

 * @param {PropertyRecord[]} records
 * @param {string} tenant
 * @returns {PropertyRecord[]}
 */
export function filterByTenant(records, tenant) {
  if (tenant === ALL_TENANTS) {
    return records;
  }
  return records.filter((record) => record.tenant === tenant);
}

/**
 * Computes the four KPI metrics required by the assessment.
 * @param {PropertyRecord[]} records
 * @returns {KpiMetrics}
 */
export function computeKpis(records) {
  let approved = 0;
  let rejected = 0;
  let totalCollection = 0;

  for (const record of records) {
    if (record.status === 'Approved') {
      approved += 1;
    } else if (record.status === 'Rejected') {
      rejected += 1;
    }
    totalCollection += record.collection_inr ?? 0;
  }

  return {
    totalRegistered: records.length,
    approved,
    rejected,
    totalCollection,
  };
}

/**
 * @param {PropertyRecord[]} records
 * @returns {{ city: string; collection: number }[]}
 */
export function computeCollectionByCity(records) {
  const totals = Object.fromEntries(TENANTS.map((city) => [city, 0]));

  for (const record of records) {
    if (totals[record.tenant] !== undefined) {
      totals[record.tenant] += record.collection_inr ?? 0;
    }
  }

  return TENANTS.map((city) => ({
    city,
    collection: totals[city],
  }));
}


/**
 * Computes Approved / Rejected / Pending counts and percentages.
 * @param {PropertyRecord[]} records
 * @returns {StatusSegment[]}
 */
export function computeStatusBreakdown(records) {
  const counts = { Approved: 0, Rejected: 0, Pending: 0 };
  const total = records.length;

  for (const record of records) {
    if (counts[record.status] !== undefined) {
      counts[record.status] += 1;
    }
  }

  const segments = [
    { key: 'approved', label: 'Approved', count: counts.Approved },
    { key: 'rejected', label: 'Rejected', count: counts.Rejected },
    { key: 'pending', label: 'Pending', count: counts.Pending },
  ];

  return segments.map((segment) => ({
    ...segment,
    percent: total > 0 ? (segment.count / total) * 100 : 0,
  }));
}

/**
 * @param {number} amount
 * @returns {string}
 */
export function formatInr(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
