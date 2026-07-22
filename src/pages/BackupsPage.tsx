import { useState, useCallback } from 'react';
import { useBackups } from '../hooks/useBackups';
import { BackupCard } from '../components/BackupCard';
import { BackupForm } from '../components/BackupForm';
import { BackupProgress } from '../utils/backupUtils';

interface BackupsPageProps {
  onRestore: (id: string) => void;
}

export function BackupsPage({ onRestore }: BackupsPageProps) {
  const { backups, create, remove } = useBackups();
  const [showForm, setShowForm] = useState(false);
  const [activeProgress, setActiveProgress] = useState<{ id: string; progress: BackupProgress } | null>(null);

  const handleCreate = useCallback(async (data: {
    name: string;
    source: string;
    destination: string;
    type: 'full' | 'incremental';
    description?: string;
  }) => {
    setShowForm(false);
    const backup = await create(data, (progress) => {
      setActiveProgress({ id: backup?.id || '', progress });
    });
    setActiveProgress(null);
  }, [create]);

  const handleDelete = useCallback((id: string) => {
    if (confirm('Are you sure you want to delete this backup?')) {
      remove(id);
    }
  }, [remove]);

  const completedCount = backups.filter(b => b.status === 'completed').length;
  const inProgressCount = backups.filter(b => b.status === 'in-progress').length;
  const failedCount = backups.filter(b => b.status === 'failed').length;

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
            Backups
          </h1>
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--color-text-secondary)',
            margin: 0,
          }}>
            Manage your backups
          </p>
        </div>
        <button
          onClick={() => setShowForm(prev => !prev)}
          style={{
            padding: '10px 20px',
            fontSize: '0.875rem',
            fontWeight: 600,
            background: showForm ? 'var(--color-surface)' : 'var(--color-primary)',
            color: showForm ? 'var(--color-text)' : '#fff',
            border: `1px solid ${showForm ? 'var(--color-border)' : 'transparent'}`,
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = showForm ? 'var(--color-background)' : 'var(--color-primary-hover)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = showForm ? 'var(--color-surface)' : 'var(--color-primary)';
          }}
        >
          {showForm ? 'Cancel' : '+ New Backup'}
        </button>
      </div>

      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        flexWrap: 'wrap',
      }}>
        <Chip label="All" count={backups.length} active />
        <Chip label="Completed" count={completedCount} color="var(--color-success)" />
        <Chip label="In Progress" count={inProgressCount} color="var(--color-info)" />
        <Chip label="Failed" count={failedCount} color="var(--color-error)" />
      </div>

      {activeProgress && (
        <div style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-primary)',
          padding: '16px',
          marginBottom: '16px',
          animation: 'fadeIn 0.3s ease forwards',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '4px',
          }}>
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--color-primary)',
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
            <span style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--color-text)',
            }}>
              Backup in progress...
            </span>
          </div>
        </div>
      )}

      {showForm && (
        <div style={{ marginBottom: '24px' }}>
          <BackupForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {backups.length === 0 ? (
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
            margin: 0,
          }}>
            No backups yet. Click "New Backup" to create one.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          {backups.map(backup => (
            <BackupCard
              key={backup.id}
              backup={backup}
              onRestore={onRestore}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Chip({ label, count, color, active }: {
  label: string;
  count: number;
  color?: string;
  active?: boolean;
}) {
  return (
    <div style={{
      padding: '6px 14px',
      borderRadius: 'var(--radius-md)',
      background: active ? 'var(--color-primary-light)' : 'var(--color-surface)',
      border: `1px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
      fontSize: '0.8rem',
      fontWeight: 500,
      color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      cursor: 'default',
    }}>
      {color && <span style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: color,
        display: 'inline-block',
      }} />}
      <span>{label}</span>
      <span style={{ fontWeight: 600 }}>({count})</span>
    </div>
  );
}
