
import React, { useState, useCallback } from 'react';
import { useHubbardSessions } from '../../hooks/useHubbardApi';
import { killSession } from '../../services/hubbardApiService';
import { Spinner } from '../ui/Spinner';
import type { HubbardSession } from '../../types';

export const SessionManagerView: React.FC = () => {
    const { sessions, loading, error, setSessions } = useHubbardSessions();
    const [killingPid, setKillingPid] = useState<number | null>(null);

    const handleKillSession = useCallback(async (pid: number) => {
        if (!window.confirm(`Are you sure you want to terminate session with PID ${pid}? This action cannot be undone.`)) {
            return;
        }
        setKillingPid(pid);
        try {
            const result = await killSession(pid);
            if (result.success) {
                setSessions(prev => prev.filter(s => s.pid !== pid));
                alert(result.message);
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (err) {
            alert('An unexpected error occurred.');
        } finally {
            setKillingPid(null);
        }
    }, [setSessions]);
    
    if (loading) return <div className="flex justify-center items-center h-full"><Spinner /></div>;
    if (error) return <p className="text-red-400 text-center">Failed to load session data.</p>;

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-900">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Port</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">PID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Login Time</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Locked Files</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {sessions.map((session: HubbardSession) => (
                            <tr key={session.pid} className="hover:bg-gray-700/50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">{session.port}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{session.user}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-mono">{session.pid}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(session.loginTime).toLocaleString()}</td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-400 font-mono">{session.lockedFiles.join(', ') || 'None'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${session.status === 'active' ? 'bg-green-800 text-green-200' : 'bg-yellow-800 text-yellow-200'}`}>
                                        {session.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button 
                                        onClick={() => handleKillSession(session.pid)} 
                                        className="text-red-400 hover:text-red-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                                        disabled={killingPid === session.pid}
                                    >
                                        {killingPid === session.pid ? 'Terminating...' : 'Kill Session'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
