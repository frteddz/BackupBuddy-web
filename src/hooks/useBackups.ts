import { useState, useEffect, useCallback } from 'react';
import { Backup, BackupProgress, BackupStats } from '../utils/backupUtils';
import * as service from '../services/backupService';

export function useBackups() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setBackups(service.getBackups());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(async (
    data: {
      name: string;
      source: string;
      destination: string;
      type: 'full' | 'incremental';
      description?: string;
    },
    onProgress: (p: BackupProgress) => void
  ): Promise<Backup> => {
    const backup = await service.createBackup(
      {
        name: data.name,
        source: data.source,
        destination: data.destination,
        type: data.type,
        description: data.description,
        filesCount: 0,
        size: 0,
      },
      onProgress
    );
    refresh();
    return backup;
  }, [refresh]);

  const remove = useCallback((id: string) => {
    service.deleteBackup(id);
    refresh();
  }, [refresh]);

  const getById = useCallback((id: string) => {
    return service.getBackupById(id);
  }, []);

  const stats: BackupStats = {
    totalBackups: backups.length,
    totalSize: backups.reduce((sum, b) => sum + (b.size || 0), 0),
    lastBackup: backups.find(b => b.status === 'completed')?.completedAt || null,
    storageUsed: backups.reduce((sum, b) => sum + (b.size || 0), 0),
    statusSummary: {
      completed: backups.filter(b => b.status === 'completed').length,
      failed: backups.filter(b => b.status === 'failed').length,
      inProgress: backups.filter(b => b.status === 'in-progress').length,
    },
  };

  return { backups, loading, stats, create, remove, getById, refresh };
}
