
import type { HubbardSession, ServerMetrics, ScheduledJob, LogEntry } from '../types';

const users = ['lauren', 'brad', 'jdoe', 'admin', 'mark', 'guest', 'support'];
const lockedFileOptions = ['DEBTOR2.DAT', 'LCIMT.DAT', 'diary.dat', 'DEBTLK.DAT', 'p2plock.tmp'];

const generateMockSessions = (count: number): HubbardSession[] => {
  const sessions: HubbardSession[] = [];
  for (let i = 0; i < count; i++) {
    const port = 6000 + i;
    sessions.push({
      port,
      pid: 12000 + Math.floor(Math.random() * 5000),
      user: users[Math.floor(Math.random() * users.length)],
      loginTime: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 8).toISOString(),
      status: Math.random() > 0.3 ? 'active' : 'idle',
      lockedFiles: Math.random() > 0.5 ? [lockedFileOptions[Math.floor(Math.random() * lockedFileOptions.length)]] : [],
    });
  }
  return sessions;
};

let mockSessions = generateMockSessions(8);

const mockScheduledJobs: ScheduledJob[] = [
    { id: 'g1', name: 'G1 Scheduling', lastRun: '2023-10-27T01:05:00Z', nextRun: '2023-10-28T01:00:00Z', status: 'success' },
    { id: 'g3', name: 'G3 Batch Confirmation', lastRun: '2023-10-27T20:30:00Z', nextRun: '2023-10-28T20:30:00Z', status: 'scheduled' },
    { id: 'u25', name: 'U25 Indexing', lastRun: '2023-10-27T02:30:00Z', nextRun: '2023-10-28T02:30:00Z', status: 'running' },
    { id: 'overnight', name: 'Overnight Export', lastRun: '2023-10-26T02:30:00Z', nextRun: '2023-10-27T02:30:00Z', status: 'failed' },
];

const mockLogs: LogEntry[] = [
  { timestamp: new Date().toISOString(), level: 'INFO', message: 'User lauren logged in from 192.168.1.10' },
  { timestamp: new Date(Date.now() - 20000).toISOString(), level: 'WARN', message: 'Port 6003 is idle for over 60 minutes.' },
  { timestamp: new Date(Date.now() - 50000).toISOString(), level: 'ERROR', message: 'Failed to execute G3 Batch Confirmation: File DEBTOR2.DAT is locked.' },
  { timestamp: new Date(Date.now() - 120000).toISOString(), level: 'INFO', message: 'G1 Scheduling job completed successfully.' },
];


const simulateDelay = <T,>(data: T, delay = 500): Promise<T> => 
  new Promise(resolve => setTimeout(() => resolve(data), delay));

export const getSessions = (): Promise<HubbardSession[]> => {
    return simulateDelay(mockSessions);
};

export const killSession = (pid: number): Promise<{ success: boolean; message: string }> => {
  const sessionIndex = mockSessions.findIndex(s => s.pid === pid);
  if (sessionIndex > -1) {
    mockSessions.splice(sessionIndex, 1);
    console.log(`Simulated killing session with PID: ${pid}`);
    return simulateDelay({ success: true, message: `Session with PID ${pid} has been terminated.` });
  }
  return simulateDelay({ success: false, message: `Session with PID ${pid} not found.` });
};

export const runFileCheck = (): Promise<string> => {
  const output = `
vutil32 -check d:\\jha\\lcs_data\\*.dat
Checking file: d:\\jha\\lcs_data\\close\\DEBTLK.DAT... OK
Checking file: d:\\jha\\lcs_data\\close\\DEBTOR2.DAT... CORRUPT: Header mismatch.
Checking file: d:\\jha\\lcs_data\\diary.dat... OK
Checking file: d:\\jha\\lcs_data\\LCIMT.DAT... OK
File check complete. 1 file(s) found with errors.
  `;
  return simulateDelay(output, 1500);
};

export const runIndexRebuild = (): Promise<string> => {
    const output = `
vutil32 -rebuild -a d:\\jha\\lcs_data\\close\\DEBTOR2.DAT
Rebuilding file: d:\\jha\\lcs_data\\close\\DEBTOR2.DAT...
Records found: 15,234.
Rebuild successful.
U25 and U26 will need to be run to rebuild indexes.
  `;
    return simulateDelay(output, 3000);
};


export const getServerMetrics = (): Promise<ServerMetrics> => {
    return simulateDelay({
        cpuUsage: Math.floor(Math.random() * (75 - 30 + 1) + 30),
        memoryUsage: { used: 6.8, total: 16 },
        diskUsage: { used: 180, total: 256 },
        latency: Math.floor(Math.random() * (30 - 5 + 1) + 5),
    });
};

export const getScheduledJobs = (): Promise<ScheduledJob[]> => {
    return simulateDelay(mockScheduledJobs);
};

export const getLogs = (): Promise<LogEntry[]> => {
    return simulateDelay(mockLogs);
}
