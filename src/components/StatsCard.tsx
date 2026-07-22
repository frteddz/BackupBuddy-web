interface StatsCardProps {
  icon: string;
  label: string;
  value: string;
  trend?: { value: string; positive: boolean } | null;
}

export function StatsCard({ icon, label, value, trend }: StatsCardProps) {
  return (
    <div style={{
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      border: '1px solid var(--color-border)',
      animation: 'fadeIn 0.3s ease forwards',
      transition: 'all var(--transition-normal)',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        e.currentTarget.style.borderColor = 'var(--color-border-hover)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'var(--color-border)';
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-primary-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.25rem',
          color: 'var(--color-primary)',
        }}>
          {icon}
        </div>
        {trend && (
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: 'var(--radius-sm)',
            background: trend.positive ? 'var(--color-success-light)' : 'var(--color-error-light)',
            color: trend.positive ? 'var(--color-success)' : 'var(--color-error)',
          }}>
            {trend.value}
          </span>
        )}
      </div>
      <div style={{ marginTop: '16px' }}>
        <div style={{
          fontSize: '0.8rem',
          color: 'var(--color-text-secondary)',
          marginBottom: '4px',
        }}>
          {label}
        </div>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--color-text)',
          lineHeight: 1.2,
        }}>
          {value}
        </div>
      </div>
    </div>
  );
}
