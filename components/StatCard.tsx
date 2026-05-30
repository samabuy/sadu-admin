interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: React.ReactNode;
}

export function StatCard({ label, value, sub, icon }: StatCardProps) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
            {label}
          </p>
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
          {sub && <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{sub}</p>}
        </div>
        {icon && (
          <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(201,168,76,0.1)', color: 'var(--gold)' }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
