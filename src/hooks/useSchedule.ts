import { useState, useEffect, useCallback } from 'react';
import { Schedule, generateId, calculateNextRun } from '../utils/backupUtils';

const STORAGE_KEY = 'backupbuddy_schedules';

function loadSchedules(): Schedule[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveSchedules(schedules: Schedule[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
}

export function useSchedule() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setSchedules(loadSchedules());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback((data: {
    name: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
    dayOfWeek?: number;
    dayOfMonth?: number;
    backupId: string;
    backupName?: string;
  }) => {
    const nextRun = calculateNextRun(data);
    const schedule: Schedule = {
      id: generateId(),
      name: data.name,
      frequency: data.frequency,
      time: data.time,
      dayOfWeek: data.dayOfWeek,
      dayOfMonth: data.dayOfMonth,
      backupId: data.backupId,
      backupName: data.backupName,
      enabled: true,
      nextRun,
      createdAt: new Date().toISOString(),
    };
    const all = loadSchedules();
    all.push(schedule);
    saveSchedules(all);
    refresh();
    return schedule;
  }, [refresh]);

  const update = useCallback((id: string, data: Partial<Schedule>) => {
    const all = loadSchedules();
    const idx = all.findIndex(s => s.id === id);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...data };
      if (data.frequency || data.time || data.dayOfWeek !== undefined || data.dayOfMonth !== undefined) {
        all[idx].nextRun = calculateNextRun(all[idx]);
      }
      saveSchedules(all);
      refresh();
    }
  }, [refresh]);

  const remove = useCallback((id: string) => {
    const all = loadSchedules();
    saveSchedules(all.filter(s => s.id !== id));
    refresh();
  }, [refresh]);

  const toggleEnabled = useCallback((id: string) => {
    const all = loadSchedules();
    const idx = all.findIndex(s => s.id === id);
    if (idx !== -1) {
      all[idx].enabled = !all[idx].enabled;
      saveSchedules(all);
      refresh();
    }
  }, [refresh]);

  return { schedules, loading, create, update, remove, toggleEnabled, refresh };
}
