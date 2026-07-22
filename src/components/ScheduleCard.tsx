import { Schedule, formatDate } from '../utils/backupUtils';

interface ScheduleCardProps {
  schedule: Schedule;
  onToggle: (id: string) => void;
  onEdit: (schedule: Schedule) => void;
  onDelete: (id: string) => void;
}

const frequencyLabels: Record<string, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function ScheduleCard({ schedule, onToggle, onEdit, onDelete }: ScheduleCardProps) {
  const frequencyDetail = schedule.frequency === 'weekly' && schedule.dayOfWeek !== undefined
    ? `on ${dayNames[schedule.dayOfWeek]}`
    : schedule.frequency === 'monthly' && schedule.dayOfMonth !== undefined
      ? `on day ${schedule.dayOfMonth}`
      : '';

  return (
    <div style={{
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--color-border)',
      padding: '16px',
      opacity: schedule.enabled ? 1 : 0.5,
      animation: 'fadeIn 0.3s ease forwards',
      transition: 'all var(--transition-normal)',
    }}
      onMouseEnter={e => {
        if (schedule.enabled) {
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          e.currentTarget.style.borderColor = 'var(--color-border-hover)';
        }
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
        <div>
          <h3 style={{
            fontSize: '0.95rem',
            fontWeight: 600,
            color: 'var(--color-text)',
            margin: 0,
          }}>
            {schedule.name}
          </h3>
          <div style={{
            fontSize: '0.8rem',
            color: 'var(--color-text-tertiary)',
            marginTop: '2px',
          }}>
            {schedule.backupName || 'No backup linked'}
          </div>
        </div>

        <label style={{
          position: 'relative',
          display: 'inline-block',
          width: '40px',
          height: '22px',
          cursor: 'pointer',
        }}>
          <input
            type="checkbox"
            checked={schedule.enabled}
            onChange={() => onToggle(schedule.id)}
            style={{ display: 'none' }}
          />
          <span style={{
            position: 'absolute',
            inset: 0,
            background: schedule.enabled ? 'var(--color-primary)' : 'var(--color-border)',
            borderRadius: '11px',
            transition: 'all var(--transition-fast)',
          }}>
            <span style={{
              position: 'absolute',
              top: '2px',
              left: schedule.enabled ? '20px' : '2px',
              width: '18px',
              height: '18px',
              background: '#fff',
              borderRadius: '50%',
              transition: 'all var(--transition-fast)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
          </span>
        </label>
      </div>

      <div style={{
        display: 'flex',
        gap: '16px',
        fontSize: '0.8rem',
        color: 'var(--color-text-secondary)',
        marginBottom: '12px',
        flexWrap: 'wrap',
      }}>
        <span>
          <strong>Frequency:</strong> {frequencyLabels[schedule.frequency]} {frequencyDetail}
        </span>
        <span>
          <strong>Time:</strong> {schedule.time}
        </span>
        <span>
          <strong>Next run:</strong> {formatDate(schedule.nextRun)}
        </span>
      </div>

      <div style={{
        display: 'flex',
        gap: '8px',
        paddingTop: '12px',
        borderTop: '1px solid var(--color-border)',
      }}>
        <button
          onClick={() => onEdit(schedule)}
          style={{
            padding: '6px 14px',
            fontSize: '0.8rem',
            fontWeight: 500,
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--color-primary)';
            e.currentTarget.style.color = 'var(--color-primary)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--color-border)';
            e.currentTarget.style.color = 'var(--color-text)';
          }}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(schedule.id)}
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
