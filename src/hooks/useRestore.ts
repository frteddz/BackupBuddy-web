import { useState, useCallback } from 'react';
import { BackupProgress } from '../utils/backupUtils';
import * as service from '../services/backupService';

interface RestoreState {
  backupId: string | null;
  status: 'idle' | 'previewing' | 'restoring' | 'completed' | 'failed';
  progress: BackupProgress | null;
  error: string | null;
}

export function useRestore() {
  const [state, setState] = useState<RestoreState>({
    backupId: null,
    status: 'idle',
    progress: null,
    error: null,
  });

  const selectBackup = useCallback((backupId: string) => {
    const backup = service.getBackupById(backupId);
    if (backup) {
      setState({
        backupId,
        status: 'previewing',
        progress: null,
        error: null,
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      backupId: null,
      status: 'idle',
      progress: null,
      error: null,
    });
  }, []);

  const startRestore = useCallback(async () => {
    if (!state.backupId) return;

    setState(prev => ({ ...prev, status: 'restoring', progress: null, error: null }));

    try {
      await service.restoreBackup(state.backupId, (progress) => {
        setState(prev => ({ ...prev, progress }));
      });
      setState(prev => ({ ...prev, status: 'completed', progress: null }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        status: 'failed',
        error: err instanceof Error ? err.message : 'Restore failed',
      }));
    }
  }, [state.backupId]);

  const backup = state.backupId ? service.getBackupById(state.backupId) : undefined;

  return {
    backup,
    ...state,
    selectBackup,
    startRestore,
    reset,
  };
}
