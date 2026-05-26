import { TENANT_OPTIONS } from '../constants/tenants';


export default function TenantFilter({ value, onChange }) {
  return (
    <div className="tenant-filter">
      <label htmlFor="tenant-select" className="tenant-filter__label">
        Filter by city
      </label>
      <select
        id="tenant-select"
        className="tenant-filter__select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {TENANT_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
