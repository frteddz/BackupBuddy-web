import { Backup, BackupProgress, generateId } from '../utils/backupUtils';

type ProgressCallback = (progress: BackupProgress) => void;

const STORAGE_KEY = 'backupbuddy_backups';

function loadBackups(): Backup[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveBackups(backups: Backup[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(backups));
}

export function getBackups(): Backup[] {
  return loadBackups();
}

export async function createBackup(
  backup: Omit<Backup, 'id' | 'createdAt' | 'completedAt' | 'status' | 'progress'>,
  onProgress: ProgressCallback
): Promise<Backup> {
  const totalFiles = Math.floor(Math.random() * 500) + 50;

  const newBackup: Backup = {
    ...backup,
    id: generateId(),
    createdAt: new Date().toISOString(),
    completedAt: null,
    status: 'in-progress',
    filesCount: totalFiles,
    progress: {
      percent: 0,
      filesProcessed: 0,
      totalFiles,
      speed: '0 MB/s',
      currentFile: 'Initializing...',
    },
  };

  const backups = loadBackups();
  backups.unshift(newBackup);
  saveBackups(backups);

  const files = generateFakeFiles(totalFiles, backup.source);
  let processed = 0;

  for (let i = 0; i < totalFiles; i++) {
    await delay(30 + Math.random() * 60);

    processed++;
    const percent = Math.round((processed / totalFiles) * 100);
    const speedValue = (0.5 + Math.random() * 4).toFixed(1);

    const progress: BackupProgress = {
      percent: Math.min(percent, 99),
      filesProcessed: processed,
      totalFiles,
      speed: `${speedValue} MB/s`,
      currentFile: files[i],
    };

    const currentBackups = loadBackups();
    const idx = currentBackups.findIndex(b => b.id === newBackup.id);
    if (idx !== -1) {
      currentBackups[idx].progress = progress;
      saveBackups(currentBackups);
    }

    onProgress(progress);
  }

  const completeBackups = loadBackups();
  const idx = completeBackups.findIndex(b => b.id === newBackup.id);
  if (idx !== -1) {
    completeBackups[idx].status = 'completed';
    completeBackups[idx].completedAt = new Date().toISOString();
    completeBackups[idx].progress = {
      percent: 100,
      filesProcessed: totalFiles,
      totalFiles,
      speed: '0 MB/s',
      currentFile: 'Complete',
    };
    completeBackups[idx].size = Math.floor(Math.random() * 100000000000) + 1000000;
    saveBackups(completeBackups);
  }

  const finalBackups = loadBackups();
  return finalBackups.find(b => b.id === newBackup.id)!;
}

export async function restoreBackup(
  backupId: string,
  onProgress: ProgressCallback
): Promise<void> {
  const backups = loadBackups();
  const backup = backups.find(b => b.id === backupId);
  if (!backup) throw new Error('Backup not found');

  const totalFiles = backup.filesCount;
  let processed = 0;

  for (let i = 0; i < totalFiles; i++) {
    await delay(20 + Math.random() * 40);
    processed++;
    const percent = Math.round((processed / totalFiles) * 100);
    const speedValue = (1 + Math.random() * 8).toFixed(1);

    onProgress({
      percent: Math.min(percent, 100),
      filesProcessed: processed,
      totalFiles,
      speed: `${speedValue} MB/s`,
      currentFile: `restoring_${i + 1}_of_${totalFiles}`,
    });
  }
}

export function deleteBackup(backupId: string): void {
  const backups = loadBackups();
  const filtered = backups.filter(b => b.id !== backupId);
  saveBackups(filtered);
}

export function getBackupById(backupId: string): Backup | undefined {
  return loadBackups().find(b => b.id === backupId);
}

function generateFakeFiles(count: number, basePath: string): string[] {
  const names = [
    'document', 'photo', 'video', 'music', 'archive',
    'config', 'database', 'notes', 'spreadsheet', 'presentation',
  ];
  const exts = [
    '.pdf', '.docx', '.jpg', '.png', '.mp4', '.mp3',
    '.zip', '.json', '.sql', '.txt', '.xlsx', '.pptx',
  ];

  const files: string[] = [];
  for (let i = 0; i < count; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const ext = exts[Math.floor(Math.random() * exts.length)];
    const dirs = ['Documents', 'Pictures', 'Videos', 'Music', 'Projects', 'Downloads'];
    const dir = dirs[Math.floor(Math.random() * dirs.length)];
    files.push(`${basePath}/${dir}/${name}_${i + 1}${ext}`);
  }
  return files;
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
