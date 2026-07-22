import { useState, useCallback } from 'react';
import { useSchedule } from '../hooks/useSchedule';
import { useBackups } from '../hooks/useBackups';
import { ScheduleCard } from '../components/ScheduleCard';
import { ScheduleForm } from '../components/ScheduleForm';
import { Schedule } from '../utils/backupUtils';

export function SchedulePage() {
  const { schedules, create, update, remove, toggleEnabled } = useSchedule();
  const { backups } = useBackups();
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  const handleCreate = useCallback((data: {
    name: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
    dayOfWeek?: number;
    dayOfMonth?: number;
    backupId: string;
    backupName?: string;
  }) => {
    if (editingSchedule) {
      update(editingSchedule.id, data);
    } else {
      create(data);
    }
    setShowForm(false);
    setEditingSchedule(null);
  }, [create, update, editingSchedule]);

  const handleEdit = useCallback((schedule: Schedule) => {
    setEditingSchedule(schedule);
    setShowForm(true);
  }, []);

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingSchedule(null);
  }, []);

  const handleDelete = useCallback((id: string) => {
    if (confirm('Delete this schedule?')) {
      remove(id);
    }
  }, [remove]);

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
            Schedules
          </h1>
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--color-text-secondary)',
            margin: 0,
          }}>
            Automate your backups
          </p>
        </div>
        <button
          onClick={() => {
            setEditingSchedule(null);
            setShowForm(prev => !prev);
          }}
          style={{
            padding: '10px 20px',
            fontSize: '0.875rem',
            fontWeight: 600,
            background: showForm && !editingSchedule ? 'var(--color-surface)' : 'var(--color-primary)',
            color: showForm && !editingSchedule ? 'var(--color-text)' : '#fff',
            border: `1px solid ${showForm && !editingSchedule ? 'var(--color-border)' : 'transparent'}`,
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={e => {
            if (showForm && !editingSchedule) {
              e.currentTarget.style.background = 'var(--color-background)';
            } else {
              e.currentTarget.style.background = 'var(--color-primary-hover)';
            }
          }}
          onMouseLeave={e => {
            if (showForm && !editingSchedule) {
              e.currentTarget.style.background = 'var(--color-surface)';
            } else {
              e.currentTarget.style.background = 'var(--color-primary)';
            }
          }}
        >
          {showForm && !editingSchedule ? 'Cancel' : '+ New Schedule'}
        </button>
      </div>

      {showForm && (
        <div style={{ marginBottom: '24px' }}>
          <ScheduleForm
            backups={backups}
            editSchedule={editingSchedule}
            onSubmit={handleCreate}
            onCancel={handleCancel}
          />
        </div>
      )}

      {schedules.length === 0 ? (
        <div style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          padding: '48px 24px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🕐</div>
          <p style={{
            fontSize: '0.9rem',
            color: 'var(--color-text-secondary)',
            margin: 0,
          }}>
            No schedules yet. Create one to automate your backups.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          {schedules.map(schedule => (
            <ScheduleCard
              key={schedule.id}
              schedule={schedule}
              onToggle={toggleEnabled}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
