import { useState } from 'react';
import { Backup, Schedule } from '../utils/backupUtils';

interface ScheduleFormProps {
  backups: Backup[];
  editSchedule?: Schedule | null;
  onSubmit: (data: {
    name: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
    dayOfWeek?: number;
    dayOfMonth?: number;
    backupId: string;
    backupName?: string;
  }) => void;
  onCancel: () => void;
}

const dayOptions = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export function ScheduleForm({ backups, editSchedule, onSubmit, onCancel }: ScheduleFormProps) {
  const [name, setName] = useState(editSchedule?.name || '');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>(editSchedule?.frequency || 'daily');
  const [time, setTime] = useState(editSchedule?.time || '02:00');
  const [dayOfWeek, setDayOfWeek] = useState<number>(editSchedule?.dayOfWeek ?? 1);
  const [dayOfMonth, setDayOfMonth] = useState<number>(editSchedule?.dayOfMonth ?? 1);
  const [backupId, setBackupId] = useState(editSchedule?.backupId || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !time || !backupId) return;

    const selectedBackup = backups.find(b => b.id === backupId);
    onSubmit({
      name: name.trim(),
      frequency,
      time,
      dayOfWeek: frequency === 'weekly' ? dayOfWeek : undefined,
      dayOfMonth: frequency === 'monthly' ? dayOfMonth : undefined,
      backupId,
      backupName: selectedBackup?.name,
    });
  };

  const isValid = name.trim() && time && backupId;

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
        {editSchedule ? 'Edit Schedule' : 'New Schedule'}
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)' }}>
            Schedule Name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Weekly Documents Backup"
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)' }}>
            Frequency
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['daily', 'weekly', 'monthly'] as const).map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setFrequency(f)}
                style={{
                  flex: 1,
                  padding: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  background: frequency === f ? 'var(--color-primary)' : 'var(--color-background)',
                  color: frequency === f ? '#fff' : 'var(--color-text)',
                  border: `1px solid ${frequency === f ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {frequency === 'weekly' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)' }}>
              Day of Week
            </label>
            <select
              value={dayOfWeek}
              onChange={e => setDayOfWeek(Number(e.target.value))}
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
            >
              {dayOptions.map(d => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>
        )}

        {frequency === 'monthly' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)' }}>
              Day of Month
            </label>
            <input
              type="number"
              min={1}
              max={28}
              value={dayOfMonth}
              onChange={e => setDayOfMonth(Math.min(28, Math.max(1, Number(e.target.value))))}
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
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)' }}>
            Time
          </label>
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)' }}>
            Backup to Schedule
          </label>
          <select
            value={backupId}
            onChange={e => setBackupId(e.target.value)}
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
          >
            <option value="">Select a backup...</option>
            {backups.filter(b => b.status === 'completed').map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
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
          {editSchedule ? 'Save Changes' : 'Create Schedule'}
        </button>
      </div>
    </form>
  );
}
