import React from 'react';
import { useLogs } from '../../hooks/useHubbardApi';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import type { LogEntry } from '../../types';
import { DocumentTextIcon } from '../ui/Icons';

export const LogView: React.FC = () => {
    const { logs, loading, error } = useLogs();

    const getLogLevelColor = (level: LogEntry['level']) => {
        switch (level) {
            case 'ERROR': return 'text-red-400';
            case 'WARN': return 'text-yellow-400';
            case 'INFO': return 'text-blue-400';
            case 'DEBUG': return 'text-gray-500';
            default: return 'text-gray-300';
        }
    };
    
    if (loading) return <div className="flex justify-center items-center h-full"><Spinner /></div>;
    if (error) return <p className="text-red-400 text-center">Failed to load logs.</p>;

    return (
        <Card title="System Log Stream" titleIcon={<DocumentTextIcon />}>
            <div className="bg-black p-4 rounded-md h-[70vh] overflow-y-auto font-mono text-sm">
                {logs.map((log, index) => (
                    <div key={index} className="flex">
                        <span className="text-gray-500 mr-4">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        <span className={`w-16 font-bold ${getLogLevelColor(log.level)}`}>{`[${log.level}]`}</span>
                        <span className="text-gray-300 flex-1">{log.message}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
};
