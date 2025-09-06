
import React, { useState, useEffect } from 'react';
import type { ViewType } from '../../types';

interface HeaderProps {
    currentView: ViewType;
}

const viewTitles: Record<ViewType, string> = {
    dashboard: 'System Overview',
    sessions: 'Active Session Manager',
    maintenance: 'System Maintenance & Jobs',
    performance: 'Real-time Performance',
    logs: 'System Logs'
};

export const Header: React.FC<HeaderProps> = ({ currentView }) => {
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        // Simulate checking server status
        const interval = setInterval(() => {
            setIsOnline(Math.random() > 0.05); // 5% chance to appear offline
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white capitalize">{viewTitles[currentView]}</h2>
            <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium text-gray-300">{isOnline ? 'Server Online' : 'Server Offline'}</span>
            </div>
        </header>
    );
};
