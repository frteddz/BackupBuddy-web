import { Backup, formatSize, formatDateTime } from '../utils/backupUtils';

interface RestoreDialogProps {
  backup: Backup;
  onConfirm: () => void;
  onCancel: () => void;
  open: boolean;
}

export function RestoreDialog({ backup, onConfirm, onCancel, open }: RestoreDialogProps) {
  if (!open) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.2s ease forwards',
    }}
      onClick={onCancel}
    >
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px',
        width: '440px',
        maxWidth: '90vw',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-xl)',
        animation: 'scaleIn 0.2s ease forwards',
      }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--color-info-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          color: 'var(--color-info)',
          marginBottom: '16px',
        }}>
          ↻
        </div>

        <h2 style={{
          fontSize: '1.2rem',
          fontWeight: 600,
          color: 'var(--color-text)',
          margin: '0 0 4px 0',
        }}>
          Restore Backup
        </h2>
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--color-text-secondary)',
          margin: '0 0 20px 0',
        }}>
          This will restore the backup files to their original location.
        </p>

        <div style={{
          background: 'var(--color-background)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          <Row label="Backup name" value={backup.name} />
          <Row label="Type" value={backup.type === 'full' ? 'Full Backup' : 'Incremental Backup'} />
          <Row label="Created" value={formatDateTime(backup.createdAt)} />
          <Row label="Source" value={backup.source} />
          <Row label="Destination" value={backup.destination} />
          <Row label="Files count" value={backup.filesCount.toLocaleString()} />
          <Row label="Total size" value={formatSize(backup.size)} />
        </div>

        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end',
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 20px',
              fontSize: '0.875rem',
              fontWeight: 500,
              background: 'transparent',
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-background)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
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
            Start Restore
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.8rem',
    }}>
      <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
      <span style={{
        color: 'var(--color-text)',
        fontWeight: 500,
        maxWidth: '220px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        textAlign: 'right',
      }}>
        {value}
      </span>
    </div>
  );
}
