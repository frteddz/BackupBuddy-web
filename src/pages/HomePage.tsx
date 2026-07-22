const features = [
  { icon: '📁', title: 'Folder Backup', desc: 'Back up entire folders with a single click. Preserve your directory structure and file permissions.' },
  { icon: '🕐', title: 'Scheduled Backups', desc: 'Automate backups on daily, weekly, or monthly schedules. Set it and forget it.' },
  { icon: '⚡', title: 'Incremental Backup', desc: 'Save time and space by only backing up files that have changed since the last backup.' },
  { icon: '↻', title: 'Restore', desc: 'Quickly restore your data from any backup point. Preview files before restoring.' },
  { icon: '📊', title: 'Progress Tracking', desc: 'Monitor backup progress in real-time with detailed status updates and speed metrics.' },
];

export function HomePage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100%',
      padding: '60px 40px',
      textAlign: 'center',
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2.5rem',
        color: '#fff',
        marginBottom: '24px',
        boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
        animation: 'scaleIn 0.4s ease forwards',
      }}>
        💾
      </div>

      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 700,
        color: 'var(--color-text)',
        margin: '0 0 8px 0',
        letterSpacing: '-0.5px',
        animation: 'fadeIn 0.4s ease forwards',
      }}>
        BackupBuddy
      </h1>

      <p style={{
        fontSize: '1.1rem',
        color: 'var(--color-text-secondary)',
        margin: '0 0 48px 0',
        animation: 'fadeIn 0.4s ease 0.1s forwards',
        opacity: 0,
      }}>
        Simple Backup Utility
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px',
        width: '100%',
        maxWidth: '900px',
      }}>
        {features.map((f, i) => (
          <div key={f.title} style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            padding: '20px',
            textAlign: 'left',
            animation: `fadeIn 0.4s ease ${0.15 + i * 0.1}s forwards`,
            opacity: 0,
            transition: 'all var(--transition-normal)',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              e.currentTarget.style.borderColor = 'var(--color-primary)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'var(--color-border)';
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{f.icon}</div>
            <h3 style={{
              fontSize: '0.95rem',
              fontWeight: 600,
              color: 'var(--color-text)',
              margin: '0 0 6px 0',
            }}>
              {f.title}
            </h3>
            <p style={{
              fontSize: '0.8rem',
              color: 'var(--color-text-secondary)',
              margin: 0,
              lineHeight: 1.5,
            }}>
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
