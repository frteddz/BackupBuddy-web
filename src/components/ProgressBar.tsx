import { useEffect, useState } from 'react';
import { BackupProgress } from '../utils/backupUtils';

interface ProgressBarProps {
  progress: BackupProgress;
  variant?: 'default' | 'restore';
}

export function ProgressBar({ progress, variant = 'default' }: ProgressBarProps) {
  const [animPercent, setAnimPercent] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimPercent(progress.percent), 50);
    return () => clearTimeout(timer);
  }, [progress.percent]);

  const color = variant === 'restore' ? 'var(--color-info)' : 'var(--color-primary)';

  return (
    <div style={{
      width: '100%',
      animation: 'fadeIn 0.3s ease forwards',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
      }}>
        <span style={{
          fontSize: '0.8rem',
          fontWeight: 500,
          color: 'var(--color-text-secondary)',
          fontFamily: 'var(--font-mono)',
        }}>
          {progress.currentFile}
        </span>
        <span style={{
          fontSize: '0.875rem',
          fontWeight: 600,
          color,
        }}>
          {progress.percent}%
        </span>
      </div>

      <div style={{
        width: '100%',
        height: '8px',
        background: 'var(--color-border)',
        borderRadius: '4px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${animPercent}%`,
          background: `linear-gradient(90deg, ${color}, ${color}dd)`,
          borderRadius: '4px',
          transition: 'width 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            animation: 'slideRight 1.5s ease-in-out infinite',
          }} />
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '6px',
        fontSize: '0.75rem',
        color: 'var(--color-text-tertiary)',
      }}>
        <span>{progress.filesProcessed.toLocaleString()} / {progress.totalFiles.toLocaleString()} files</span>
        <span>{progress.speed}</span>
      </div>
    </div>
  );
}
