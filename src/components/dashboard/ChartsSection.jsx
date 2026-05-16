import {
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Card from '../Card';
import { CardSkeleton } from '../Skeleton';
import { CHART_COLORS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

function DonutChart({ title, data, delay = 0 }) {
  return (
    <Card delay={delay}>
      <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={95}
            paddingAngle={3}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

export default function ChartsSection({
  statusChartData,
  volumeOverTime,
  currencyChartData,
  loading,
}) {
  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <DonutChart title="Transaction Status" data={statusChartData} />

      <Card delay={0.05}>
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
          Volume Over Time
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={volumeOverTime}>
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => formatCurrency(v)} />
            <Line
              type="monotone"
              dataKey="volume"
              stroke="#0891b2"
              strokeWidth={3}
              dot={{ fill: '#0891b2', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <DonutChart title="Currency Distribution" data={currencyChartData} delay={0.1} />
    </div>
  );
}
