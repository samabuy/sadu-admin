'use client';

import { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Download } from 'lucide-react';

interface Props {
  dailyRevenue: { date: string; total: number }[];
  topProducts: { name: string; revenue: number }[];
  paymentMethods: { name: string; value: number }[];
  emirates: { name: string; value: number }[];
}

const COLORS = ['#C9A84C', '#9A8F7A', '#3F7D58', '#6495ED', '#B54747', '#D4B85A'];

const tooltipStyle = {
  backgroundColor: 'var(--card-bg)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  color: 'var(--text-primary)',
  fontSize: 12,
};

const cardStyle = { backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 };

export function ReportsClient({ dailyRevenue, topProducts, paymentMethods, emirates }: Props) {
  const totalRevenue = dailyRevenue.reduce((s, d) => s + d.total, 0);

  function exportCsv() {
    const rows = [['Date', 'Revenue (AED)'], ...dailyRevenue.map((d) => [d.date, d.total])];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `sadu-revenue-${Date.now()}.csv`;
    a.click();
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Reports</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Last 30 days · Total revenue: AED {totalRevenue.toLocaleString()}</p>
        </div>
        <button
          onClick={exportCsv}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
          style={{ backgroundColor: 'rgba(201,168,76,0.1)', color: 'var(--gold)', border: '1px solid rgba(201,168,76,0.3)' }}
        >
          <Download size={15} /> Export CSV
        </button>
      </div>

      <div className="space-y-6">
        {/* Revenue chart */}
        <div style={cardStyle}>
          <h2 className="font-semibold text-sm mb-6" style={{ color: 'var(--text-primary)' }}>Revenue — Last 30 Days (AED)</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={dailyRevenue}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
                tickFormatter={(v) => v.slice(5)}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v) => [`AED ${Number(v).toLocaleString()}`, 'Revenue']}
                labelStyle={{ color: 'var(--text-secondary)', fontSize: 11 }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="var(--gold)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: 'var(--gold)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Top products */}
          <div style={cardStyle}>
            <h2 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Top 10 Products by Revenue</h2>
            {topProducts.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No data yet</p>
            ) : (
              <div className="space-y-3">
                {topProducts.map((p, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs font-bold w-5" style={{ color: 'var(--text-secondary)' }}>{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs truncate" style={{ color: 'var(--text-primary)' }}>{p.name}</p>
                      <div
                        className="h-1 rounded-full mt-1"
                        style={{
                          backgroundColor: 'var(--gold)',
                          width: `${Math.round((p.revenue / topProducts[0]!.revenue) * 100)}%`,
                          opacity: 0.7,
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium" style={{ color: 'var(--gold)' }}>AED {p.revenue.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment method pie */}
          <div style={cardStyle}>
            <h2 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Orders by Payment Method</h2>
            {paymentMethods.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={paymentMethods} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                    {paymentMethods.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`AED ${Number(v).toLocaleString()}`, 'Revenue']} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* By emirate */}
        <div style={cardStyle}>
          <h2 className="font-semibold text-sm mb-6" style={{ color: 'var(--text-primary)' }}>Revenue by Emirate (AED)</h2>
          {emirates.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={emirates}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`AED ${Number(v).toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="value" fill="var(--gold)" radius={[4, 4, 0, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
