

export type ViewType = 'dashboard' | 'sessions' | 'maintenance' | 'performance' | 'logs' | 'settings';

export interface HubbardSession {
  port: number;
  pid: number;
  user: string;
  loginTime: string;
  status: 'active' | 'idle';
  lockedFiles: string[];
}

export interface ServerMetrics {
  cpuUsage: number;
  memoryUsage: {
    used: number;
    total: number;
  };
  diskUsage: {
    used: number;
    total: number;
  };
  latency: number;
}

export interface ScheduledJob {
  id: string;
  name: string;
  lastRun: string;
  nextRun: string;
  status: 'success' | 'failed' | 'running' | 'scheduled';
}

export interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
}