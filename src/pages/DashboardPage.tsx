import { useBackups } from '../hooks/useBackups';
import { StatsCard } from '../components/StatsCard';
import { BackupCard } from '../components/BackupCard';
import { formatSize, formatDate } from '../utils/backupUtils';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
  onRestore: (id: string) => void;
}

export function DashboardPage({ onNavigate, onRestore }: DashboardPageProps) {
  const { backups, stats } = useBackups();

  const recentBackups = backups.slice(0, 5);

  return (
    <div style={{
      padding: '32px',
      animation: 'fadeIn 0.3s ease forwards',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '28px',
      }}>
        <div>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--color-text)',
            margin: '0 0 4px 0',
          }}>
            Dashboard
          </h1>
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--color-text-secondary)',
            margin: 0,
          }}>
            Overview of your backup status
          </p>
        </div>
        <button
          onClick={() => onNavigate('backups')}
          style={{
            padding: '10px 20px',
            fontSize: '0.875rem',
            fontWeight: 600,
            background: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary-hover)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-primary)'; }}
        >
          + New Backup
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
      }}>
        <StatsCard
          icon="💾"
          label="Total Backups"
          value={stats.totalBackups.toString()}
        />
        <StatsCard
          icon="📅"
          label="Last Backup"
          value={formatDate(stats.lastBackup)}
          trend={stats.totalBackups > 0 ? { value: 'Active', positive: true } : null}
        />
        <StatsCard
          icon="📊"
          label="Storage Used"
          value={formatSize(stats.storageUsed)}
          trend={stats.storageUsed > 0 ? { value: formatSize(stats.storageUsed), positive: true } : null}
        />
        <StatsCard
          icon={stats.statusSummary.inProgress > 0 ? '⟳' : '✓'}
          label="Status"
          value={
            stats.statusSummary.inProgress > 0
              ? `${stats.statusSummary.inProgress} Running`
              : 'All Clear'
          }
          trend={
            stats.statusSummary.failed > 0
              ? { value: `${stats.statusSummary.failed} Failed`, positive: false }
              : undefined
          }
        />
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
      }}>
        <h2 style={{
          fontSize: '1.1rem',
          fontWeight: 600,
          color: 'var(--color-text)',
          margin: 0,
        }}>
          Recent Backups
        </h2>
        {backups.length > 5 && (
          <button
            onClick={() => onNavigate('backups')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-primary)',
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            View all
          </button>
        )}
      </div>

      {recentBackups.length === 0 ? (
        <div style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          padding: '48px 24px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📂</div>
          <p style={{
            fontSize: '0.9rem',
            color: 'var(--color-text-secondary)',
            margin: '0 0 16px 0',
          }}>
            No backups yet. Create your first backup to get started.
          </p>
          <button
            onClick={() => onNavigate('backups')}
            style={{
              padding: '10px 20px',
              fontSize: '0.875rem',
              fontWeight: 600,
              background: 'var(--color-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary-hover)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-primary)'; }}
          >
            Create Backup
          </button>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          {recentBackups.map(backup => (
            <BackupCard
              key={backup.id}
              backup={backup}
              onRestore={onRestore}
              onDelete={() => { if (confirm('Delete this backup?')) { } }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
