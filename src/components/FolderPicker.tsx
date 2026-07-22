import { useState } from 'react';
import { validatePath } from '../utils/backupUtils';

interface FolderPickerProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  error?: string;
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'var(--color-text)',
  },
  wrapper: {
    display: 'flex',
    gap: '8px',
  },
  input: {
    flex: 1,
    padding: '10px 12px',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    background: 'var(--color-surface)',
    color: 'var(--color-text)',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color var(--transition-fast)',
  },
  button: {
    padding: '10px 16px',
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--color-text)',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    whiteSpace: 'nowrap',
  },
  error: {
    fontSize: '0.8rem',
    color: 'var(--color-error)',
  },
};

export function FolderPicker({ value, onChange, label, placeholder, error }: FolderPickerProps) {
  const [localError, setLocalError] = useState<string | undefined>(error);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    const result = validatePath(val);
    setLocalError(result.valid ? undefined : result.error);
  };

  const handleBrowse = () => {
    const path = prompt('Enter folder path:', value || '/home/user/');
    if (path) {
      onChange(path);
      const result = validatePath(path);
      setLocalError(result.valid ? undefined : result.error);
    }
  };

  const displayError = error || localError;

  return (
    <div style={styles.container}>
      <label style={styles.label}>{label}</label>
      <div style={styles.wrapper}>
        <input
          style={styles.input}
          type="text"
          value={value}
          onChange={handleInput}
          placeholder={placeholder || 'Select a folder...'}
        />
        <button
          style={styles.button}
          onClick={handleBrowse}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--color-primary)';
            e.currentTarget.style.color = 'var(--color-primary)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--color-border)';
            e.currentTarget.style.color = 'var(--color-text)';
          }}
        >
          Browse
        </button>
      </div>
      {displayError && <span style={styles.error}>{displayError}</span>}
    </div>
  );
}
