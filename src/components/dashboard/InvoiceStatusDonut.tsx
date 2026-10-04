'use client';

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface Props {
  stats: {
    paid: number;
    sent: number;
    draft: number;
    overdue: number;
  };
}

export default function InvoiceStatusDonut({ stats }: Props) {
  const data = [
    { name: 'Paid', value: stats.paid || 4, color: '#10b981' },
    { name: 'Sent', value: stats.sent || 3, color: '#3b82f6' },
    { name: 'Draft', value: stats.draft || 2, color: '#94a3b8' },
    { name: 'Overdue', value: stats.overdue || 1, color: '#ef4444' },
  ];

  return (
    <div className="h-64 w-full flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            innerRadius={55}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex gap-4 text-xs mt-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-slate-400">{item.name} ({item.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
