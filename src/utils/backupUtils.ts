export interface Backup {
  id: string;
  name: string;
  type: 'full' | 'incremental';
  source: string;
  destination: string;
  size: number;
  filesCount: number;
  createdAt: string;
  completedAt: string | null;
  status: 'completed' | 'failed' | 'in-progress' | 'pending';
  description?: string;
  progress?: BackupProgress;
}

export interface BackupProgress {
  percent: number;
  filesProcessed: number;
  totalFiles: number;
  speed: string;
  currentFile: string;
}

export interface Schedule {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  dayOfWeek?: number;
  dayOfMonth?: number;
  backupId: string;
  enabled: boolean;
  nextRun: string;
  createdAt: string;
  backupName?: string;
}

export interface BackupStats {
  totalBackups: number;
  totalSize: number;
  lastBackup: string | null;
  storageUsed: number;
  statusSummary: {
    completed: number;
    failed: number;
    inProgress: number;
  };
}

export function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function calculateNextRun(schedule: {
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  dayOfWeek?: number;
  dayOfMonth?: number;
}): string {
  const now = new Date();
  const [hours, minutes] = schedule.time.split(':').map(Number);
  const next = new Date(now);
  next.setHours(hours, minutes, 0, 0);

  if (next <= now) {
    next.setDate(next.getDate() + 1);
  }

  if (schedule.frequency === 'weekly' && schedule.dayOfWeek !== undefined) {
    const currentDay = now.getDay();
    let daysUntil = schedule.dayOfWeek - currentDay;
    if (daysUntil <= 0 || (daysUntil === 0 && next <= now)) daysUntil += 7;
    next.setDate(now.getDate() + daysUntil);
  }

  if (schedule.frequency === 'monthly' && schedule.dayOfMonth !== undefined) {
    next.setDate(schedule.dayOfMonth);
    if (next <= now) {
      next.setMonth(next.getMonth() + 1);
    }
  }

  return next.toISOString();
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'completed': return 'var(--color-success)';
    case 'failed': return 'var(--color-error)';
    case 'in-progress': return 'var(--color-info)';
    case 'pending': return 'var(--color-warning)';
    default: return 'var(--color-text-secondary)';
  }
}

export function getStatusBg(status: string): string {
  switch (status) {
    case 'completed': return 'var(--color-success-light)';
    case 'failed': return 'var(--color-error-light)';
    case 'in-progress': return 'var(--color-info-light)';
    case 'pending': return 'var(--color-warning-light)';
    default: return 'var(--color-surface)';
  }
}

export function getStatusIcon(status: string): string {
  switch (status) {
    case 'completed': return '✓';
    case 'failed': return '✕';
    case 'in-progress': return '⟳';
    case 'pending': return '○';
    default: return '?';
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function validatePath(path: string): { valid: boolean; error?: string } {
  if (!path.trim()) {
    return { valid: false, error: 'Path cannot be empty' };
  }
  if (path.length > 4096) {
    return { valid: false, error: 'Path is too long' };
  }
  return { valid: true };
}
