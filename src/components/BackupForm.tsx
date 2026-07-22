import { useState } from 'react';
import { FolderPicker } from './FolderPicker';

interface BackupFormProps {
  onSubmit: (data: {
    name: string;
    source: string;
    destination: string;
    type: 'full' | 'incremental';
    description?: string;
  }) => void;
  onCancel: () => void;
}

export function BackupForm({ onSubmit, onCancel }: BackupFormProps) {
  const [name, setName] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [type, setType] = useState<'full' | 'incremental'>('full');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !source.trim() || !destination.trim()) return;
    onSubmit({ name: name.trim(), source: source.trim(), destination: destination.trim(), type, description: description.trim() || undefined });
  };

  const isValid = name.trim() && source.trim() && destination.trim();

  return (
    <form onSubmit={handleSubmit} style={{
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--color-border)',
      padding: '24px',
      animation: 'fadeIn 0.3s ease forwards',
    }}>
      <h2 style={{
        fontSize: '1.1rem',
        fontWeight: 600,
        color: 'var(--color-text)',
        margin: '0 0 20px 0',
      }}>
        New Backup
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)' }}>
            Backup Name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="My Important Backup"
            style={{
              padding: '10px 12px',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-background)',
              color: 'var(--color-text)',
              fontSize: '0.875rem',
              outline: 'none',
              transition: 'border-color var(--transition-fast)',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
          />
        </div>

        <FolderPicker
          value={source}
          onChange={setSource}
          label="Source Folder"
          placeholder="/home/user/Documents"
        />

        <FolderPicker
          value={destination}
          onChange={setDestination}
          label="Destination Folder"
          placeholder="/mnt/backup/drive"
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)' }}>
            Backup Type
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setType('full')}
              style={{
                flex: 1,
                padding: '10px',
                fontSize: '0.85rem',
                fontWeight: 500,
                background: type === 'full' ? 'var(--color-primary)' : 'var(--color-background)',
                color: type === 'full' ? '#fff' : 'var(--color-text)',
                border: `1px solid ${type === 'full' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              Full Backup
            </button>
            <button
              type="button"
              onClick={() => setType('incremental')}
              style={{
                flex: 1,
                padding: '10px',
                fontSize: '0.85rem',
                fontWeight: 500,
                background: type === 'incremental' ? 'var(--color-primary)' : 'var(--color-background)',
                color: type === 'incremental' ? '#fff' : 'var(--color-text)',
                border: `1px solid ${type === 'incremental' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              Incremental
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)' }}>
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="What does this backup contain?"
            rows={3}
            style={{
              padding: '10px 12px',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-background)',
              color: 'var(--color-text)',
              fontSize: '0.875rem',
              outline: 'none',
              resize: 'vertical',
              transition: 'border-color var(--transition-fast)',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
          />
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: '10px',
        justifyContent: 'flex-end',
        marginTop: '24px',
        paddingTop: '16px',
        borderTop: '1px solid var(--color-border)',
      }}>
        <button
          type="button"
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
          type="submit"
          disabled={!isValid}
          style={{
            padding: '10px 20px',
            fontSize: '0.875rem',
            fontWeight: 600,
            background: isValid ? 'var(--color-primary)' : 'var(--color-border)',
            color: isValid ? '#fff' : 'var(--color-text-tertiary)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: isValid ? 'pointer' : 'not-allowed',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={e => {
            if (isValid) e.currentTarget.style.background = 'var(--color-primary-hover)';
          }}
          onMouseLeave={e => {
            if (isValid) e.currentTarget.style.background = 'var(--color-primary)';
          }}
        >
          Create Backup
        </button>
      </div>
    </form>
  );
}
