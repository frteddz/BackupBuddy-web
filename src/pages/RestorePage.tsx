import { useBackups } from '../hooks/useBackups';
import { useRestore } from '../hooks/useRestore';
import { RestoreDialog } from '../components/RestoreDialog';
import { ProgressBar } from '../components/ProgressBar';
import { formatSize, formatDateTime, getStatusIcon } from '../utils/backupUtils';

export function RestorePage() {
  const { backups } = useBackups();
  const {
    backup,
    status,
    progress,
    error,
    selectBackup,
    startRestore,
    reset,
  } = useRestore();

  const completedBackups = backups.filter(b => b.status === 'completed');

  const handleSelect = (id: string) => {
    selectBackup(id);
  };

  return (
    <div style={{
      padding: '32px',
      animation: 'fadeIn 0.3s ease forwards',
    }}>
      <div style={{
        marginBottom: '28px',
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--color-text)',
          margin: '0 0 4px 0',
        }}>
          Restore
        </h1>
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--color-text-secondary)',
          margin: 0,
        }}>
          Select a backup to restore your data
        </p>
      </div>

      {status === 'completed' && (
        <div style={{
          background: 'var(--color-success-light)',
          border: '1px solid var(--color-success)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          textAlign: 'center',
          marginBottom: '24px',
          animation: 'scaleIn 0.3s ease forwards',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>✓</div>
          <h2 style={{
            fontSize: '1.2rem',
            fontWeight: 600,
            color: 'var(--color-success)',
            margin: '0 0 4px 0',
          }}>
            Restore Complete
          </h2>
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--color-text-secondary)',
            margin: '0 0 16px 0',
          }}>
            All files have been successfully restored.
          </p>
          <button
            onClick={reset}
            style={{
              padding: '10px 20px',
              fontSize: '0.875rem',
              fontWeight: 600,
              background: 'var(--color-success)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            Restore Another
          </button>
        </div>
      )}

      {status === 'failed' && (
        <div style={{
          background: 'var(--color-error-light)',
          border: '1px solid var(--color-error)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          textAlign: 'center',
          marginBottom: '24px',
          animation: 'scaleIn 0.3s ease forwards',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>✕</div>
          <h2 style={{
            fontSize: '1.2rem',
            fontWeight: 600,
            color: 'var(--color-error)',
            margin: '0 0 4px 0',
          }}>
            Restore Failed
          </h2>
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--color-text-secondary)',
            margin: '0 0 16px 0',
          }}>
            {error || 'An unexpected error occurred during restore.'}
          </p>
          <button
            onClick={reset}
            style={{
              padding: '10px 20px',
              fontSize: '0.875rem',
              fontWeight: 600,
              background: 'transparent',
              color: 'var(--color-error)',
              border: '1px solid var(--color-error)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-error-light)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            Try Again
          </button>
        </div>
      )}

      {status === 'restoring' && progress && (
        <div style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          padding: '24px',
          marginBottom: '24px',
          animation: 'fadeIn 0.3s ease forwards',
        }}>
          <h3 style={{
            fontSize: '0.95rem',
            fontWeight: 600,
            color: 'var(--color-text)',
            margin: '0 0 16px 0',
          }}>
            Restoring {backup?.name}
          </h3>
          <ProgressBar progress={progress} variant="restore" />
        </div>
      )}

      {status !== 'completed' && status !== 'restoring' && (
        <>
          {completedBackups.length === 0 ? (
            <div style={{
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              padding: '48px 24px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📦</div>
              <p style={{
                fontSize: '0.9rem',
                color: 'var(--color-text-secondary)',
                margin: 0,
              }}>
                No completed backups available to restore.
              </p>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}>
              {completedBackups.map(b => (
                <div
                  key={b.id}
                  onClick={() => handleSelect(b.id)}
                  style={{
                    background: backup?.id === b.id ? 'var(--color-primary-light)' : 'var(--color-surface)',
                    borderRadius: 'var(--radius-lg)',
                    border: `1px solid ${backup?.id === b.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    animation: 'fadeIn 0.3s ease forwards',
                  }}
                  onMouseEnter={e => {
                    if (backup?.id !== b.id) {
                      e.currentTarget.style.borderColor = 'var(--color-border-hover)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (backup?.id !== b.id) {
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <div>
                      <div style={{
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: 'var(--color-text)',
                        marginBottom: '4px',
                      }}>
                        {b.name}
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '16px',
                        fontSize: '0.78rem',
                        color: 'var(--color-text-tertiary)',
                      }}>
                        <span>{formatDateTime(b.createdAt)}</span>
                        <span>{formatSize(b.size)}</span>
                        <span>{b.filesCount.toLocaleString()} files</span>
                        <span>{b.type}</span>
                      </div>
                    </div>
                    <span style={{
                      fontSize: '1.2rem',
                      color: backup?.id === b.id ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
                    }}>
                      {getStatusIcon(b.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {backup && status === 'previewing' && (
        <div style={{ marginTop: '24px' }}>
          <RestoreDialog
            backup={backup}
            open
            onConfirm={startRestore}
            onCancel={reset}
          />
        </div>
      )}
    </div>
  );
}
