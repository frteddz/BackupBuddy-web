import { Backup, formatSize, formatDate, getStatusColor, getStatusBg, getStatusIcon } from '../utils/backupUtils';
import { ProgressBar } from './ProgressBar';

interface BackupCardProps {
  backup: Backup;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
}

export function BackupCard({ backup, onRestore, onDelete }: BackupCardProps) {
  const isInProgress = backup.status === 'in-progress';

  return (
    <div style={{
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--color-border)',
      padding: '16px',
      animation: 'fadeIn 0.3s ease forwards',
      transition: 'all var(--transition-normal)',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        e.currentTarget.style.borderColor = 'var(--color-border-hover)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'var(--color-border)';
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '4px',
          }}>
            <h3 style={{
              fontSize: '0.95rem',
              fontWeight: 600,
              color: 'var(--color-text)',
              margin: 0,
            }}>
              {backup.name}
            </h3>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 500,
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              background: backup.type === 'full' ? 'var(--color-primary-light)' : 'var(--color-info-light)',
              color: backup.type === 'full' ? 'var(--color-primary)' : 'var(--color-info)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              {backup.type}
            </span>
          </div>
          <div style={{
            fontSize: '0.8rem',
            color: 'var(--color-text-tertiary)',
          }}>
            {formatDate(backup.createdAt)}
          </div>
        </div>

        <span style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          padding: '4px 10px',
          borderRadius: 'var(--radius-sm)',
          background: getStatusBg(backup.status),
          color: getStatusColor(backup.status),
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <span>{getStatusIcon(backup.status)}</span>
          <span style={{ textTransform: 'capitalize' }}>{backup.status}</span>
        </span>
      </div>

      <div style={{
        display: 'flex',
        gap: '20px',
        fontSize: '0.8rem',
        color: 'var(--color-text-secondary)',
        marginBottom: '12px',
        flexWrap: 'wrap',
      }}>
        <span>
          <strong>Size:</strong> {formatSize(backup.size)}
        </span>
        <span>
          <strong>Files:</strong> {backup.filesCount.toLocaleString()}
        </span>
        <span>
          <strong>Source:</strong> {backup.source.split('/').pop() || backup.source}
        </span>
      </div>

      {isInProgress && backup.progress && (
        <div style={{ marginBottom: '12px' }}>
          <ProgressBar progress={backup.progress} />
        </div>
      )}

      <div style={{
        display: 'flex',
        gap: '8px',
        paddingTop: '12px',
        borderTop: '1px solid var(--color-border)',
      }}>
        {backup.status === 'completed' && (
          <button
            onClick={() => onRestore(backup.id)}
            style={{
              padding: '6px 14px',
              fontSize: '0.8rem',
              fontWeight: 500,
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
            Restore
          </button>
        )}
        <button
          onClick={() => onDelete(backup.id)}
          style={{
            padding: '6px 14px',
            fontSize: '0.8rem',
            fontWeight: 500,
            background: 'transparent',
            color: 'var(--color-error)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--color-error)';
            e.currentTarget.style.background = 'var(--color-error-light)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--color-border)';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
