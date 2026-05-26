import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { computeCollectionByCity, formatInr } from '../utils/analytics';
import { ALL_TENANTS } from '../constants/tenants';
import { brightenColor, CITY_COLORS } from '../constants/colors';

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  const { city, collection, fill } = payload[0].payload;

  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__city">{city}</p>
      <p className="chart-tooltip__value" style={{ color: fill }}>
        {formatInr(collection)}
      </p>
    </div>
  );
}

function getChartThemeVars() {
  const style = getComputedStyle(document.documentElement);
  return {
    grid: style.getPropertyValue('--chart-grid').trim(),
    tick: style.getPropertyValue('--chart-tick').trim(),
  };
}

export default function CollectionChart({ records, selectedTenant }) {
  const chartData = useMemo(() => {
    return computeCollectionByCity(records).map((entry) => ({
      ...entry,
      fill: CITY_COLORS[entry.city] ?? '#2563eb',
    }));
  }, [records]);

  const { grid, tick } = getChartThemeVars();
  const isFiltered = selectedTenant !== ALL_TENANTS;

  return (
    <section
      className="panel chart-section"
      aria-label="Collection comparison by city"
    >
      <header className="panel__header chart-section__header">
        <h2>Total Collection by City</h2>
        
      </header>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={360}>
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 16, left: 8, bottom: 48 }}
          >
            <CartesianGrid
              stroke={grid}
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="city"
              tick={{ fontSize: 12, fill: tick }}
              axisLine={{ stroke: grid }}
              tickLine={{ stroke: grid }}
              angle={-35}
              textAnchor="end"
              interval={0}
              height={70}
            />
            <YAxis
              tick={{ fill: tick, fontSize: 12 }}
              axisLine={{ stroke: grid }}
              tickLine={{ stroke: grid }}
              tickFormatter={(value) =>
                value >= 100000 ? `${(value / 100000).toFixed(1)}L` : value
              }
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ fill: 'var(--accent-soft)', radius: 4 }}
            />
            <Bar
              dataKey="collection"
              name="Collection"
              radius={[6, 6, 0, 0]}
              activeBar={{
                stroke: '#fff',
                strokeWidth: 2,
                filter: 'brightness(1.15)',
              }}
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.city}
                  fill={entry.fill}
                  fillOpacity={
                    isFiltered && entry.city !== selectedTenant ? 0.35 : 1
                  }
                  stroke={
                    isFiltered && entry.city === selectedTenant
                      ? brightenColor(entry.fill, 0.25)
                      : 'none'
                  }
                  strokeWidth={
                    isFiltered && entry.city === selectedTenant ? 2 : 0
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <ul className="chart-legend" aria-hidden="true">
        {chartData.map((entry) => (
          <li key={entry.city} className="chart-legend__item">
            <span
              className="chart-legend__dot"
              style={{ background: entry.fill }}
            />
            {entry.city}
          </li>
        ))}
      </ul>
    </section>
  );
}
