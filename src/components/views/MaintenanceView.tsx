import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { runFileCheck, runIndexRebuild } from '../../services/hubbardApiService';
import { Spinner } from '../ui/Spinner';

export const MaintenanceView: React.FC = () => {
    const [output, setOutput] = useState<string>('Command output will be shown here.');
    const [isLoading, setIsLoading] = useState(false);

    const handleRunFileCheck = async () => {
        console.log('[UI Action] User triggered "Check File Integrity"');
        setIsLoading(true);
        setOutput('Running file integrity check...');
        try {
            const result = await runFileCheck();
            setOutput(result);
            console.log('[UI Action] "Check File Integrity" completed.');
        } catch (error) {
            const errorMessage = 'Error running file integrity check.';
            setOutput(errorMessage);
            console.error(`[UI Action] ${errorMessage}`, error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRunIndexRebuild = async () => {
        if (!window.confirm('WARNING: Rebuilding indexes can be a dangerous operation and may require system downtime. Are you sure you want to proceed?')) {
            return;
        }
        console.log('[UI Action] User triggered "Rebuild Corrupt Indexes"');
        setIsLoading(true);
        setOutput('Starting index rebuild process...');
        try {
            const result = await runIndexRebuild();
            setOutput(result);
            console.log('[UI Action] "Rebuild Corrupt Indexes" completed.');
        } catch (error) {
            const errorMessage = 'Error running index rebuild.';
            setOutput(errorMessage);
            console.error(`[UI Action] ${errorMessage}`, error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 gap-6">
            <Card title="System Utilities">
                <div className="space-y-4">
                    <p className="text-sm text-gray-400">Run system utilities to check for file corruption and perform maintenance. These tasks can be resource-intensive.</p>
                    <div className="flex space-x-4">
                        <button
                            onClick={handleRunFileCheck}
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-wait"
                        >
                            Check File Integrity
                        </button>
                        <button
                            onClick={handleRunIndexRebuild}
                            disabled={isLoading}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-500 disabled:cursor-wait"
                        >
                            Rebuild Corrupt Indexes
                        </button>
                    </div>
                </div>
            </Card>

            <Card title="Utility Output">
                <div className="bg-black p-4 rounded-md h-96 overflow-y-auto font-mono text-sm text-green-400 whitespace-pre-wrap">
                    {isLoading ? <div className="flex items-center space-x-2"><Spinner size="sm" /><span>Processing...</span></div> : output}
                </div>
            </Card>
        </div>
    );
};
