
import React from 'react';
import { Card } from '../ui/Card';
import { StatusOnlineIcon, StatusOfflineIcon, WrenchScrewdriverIcon, ChartBarIcon, UsersIcon } from '../ui/Icons';
import { PerformanceView } from './PerformanceView';
import { useScheduledJobs, useHubbardSessions } from '../../hooks/useHubbardApi';


export const DashboardView: React.FC = () => {
    const { jobs, loading: jobsLoading, error: jobsError } = useScheduledJobs();
    const { sessions, loading: sessionsLoading, error: sessionsError } = useHubbardSessions();

    const renderJobStatus = () => {
        if (jobsLoading) return <p className="text-gray-400">Loading jobs...</p>;
        if (jobsError) return <p className="text-red-400">Error loading jobs.</p>;
        return (
            <ul className="space-y-2">
                {jobs.map(job => (
                    <li key={job.id} className="flex justify-between items-center text-sm">
                        <span>{job.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            job.status === 'success' ? 'bg-green-700 text-green-100' : 
                            job.status === 'failed' ? 'bg-red-700 text-red-100' : 
                            job.status === 'running' ? 'bg-blue-700 text-blue-100' : 
                            'bg-gray-600 text-gray-200'
                        }`}>
                            {job.status}
                        </span>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card title="Server Status" titleIcon={<StatusOnlineIcon/>}>
                    <div className="flex items-center space-x-3">
                        <StatusOnlineIcon />
                        <span className="text-lg font-semibold text-green-400">Online</span>
                    </div>
                </Card>
                <Card title="Active Sessions" titleIcon={<UsersIcon/>}>
                     <p className="text-3xl font-bold">{sessionsLoading ? '-' : sessions.length}</p>
                </Card>
                 <Card title="Jobs Failing" titleIcon={<WrenchScrewdriverIcon/>}>
                     <p className="text-3xl font-bold text-red-400">{jobsLoading ? '-' : jobs.filter(j => j.status === 'failed').length}</p>
                </Card>
                 <Card title="CPU Load" titleIcon={<ChartBarIcon/>}>
                     <p className="text-3xl font-bold">~45%</p>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <PerformanceView />
                </div>
                <Card title="Scheduled Jobs Status" className="h-full">
                   {renderJobStatus()}
                </Card>
            </div>
        </div>
    );
};
