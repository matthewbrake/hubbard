import React, { useState, useEffect } from 'react';
import type { ViewType } from '../../types';
import { getSessions } from '../../services/hubbardApiService';

interface HeaderProps {
    currentView: ViewType;
}

const viewTitles: Record<ViewType, string> = {
    dashboard: 'System Overview',
    sessions: 'Active Session Manager',
    maintenance: 'System Maintenance & Jobs',
    performance: 'Real-time Performance',
    logs: 'System Logs',
    settings: 'Configuration & Settings'
};

export const Header: React.FC<HeaderProps> = ({ currentView }) => {
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                // Use a lightweight API call as a proxy for agent connectivity.
                await getSessions();
                setIsOnline(true);
            } catch {
                setIsOnline(false);
            }
        };
        
        checkStatus(); // Initial check
        const interval = setInterval(checkStatus, 10000); // Check every 10 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white capitalize">{viewTitles[currentView]}</h2>
            <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} role="status" aria-live="polite"></div>
                <span className="text-sm font-medium text-gray-300">{isOnline ? 'Agent Connected' : 'Agent Disconnected'}</span>
            </div>
        </header>
    );
};
