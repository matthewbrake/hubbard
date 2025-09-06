import React from 'react';
import { Card } from '../ui/Card';
import config from '../../config';

export const SettingsView: React.FC = () => {

  const renderConfigItem = (label: string, value: string, isSecret: boolean = false, description?: string) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <dt className="text-sm font-medium text-gray-400">{label}</dt>
      <dd className="mt-1 text-sm text-gray-200 sm:mt-0 sm:col-span-2">
        <span className="font-mono bg-gray-700 px-2 py-1 rounded">
            {isSecret ? '********' : value}
        </span>
        {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
      </dd>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card title="Frontend Configuration">
        <div className="border-t border-gray-700">
          <dl className="divide-y divide-gray-700">
            {renderConfigItem('Backend API URL', config.hubbardAgentUrl, false, "The URL the frontend uses to contact the backend API.")}
            {renderConfigItem('Backend API Key', config.hubbardAgentApiKey, true, "The secret key for authenticating with the backend.")}
          </dl>
        </div>
         <p className="mt-4 text-xs text-gray-500">
            This configuration is loaded from environment variables at build time. To change these values, you would modify your <code>.env</code> file and rebuild the application.
        </p>
      </Card>
      <Card title="Conceptual Agent Configuration">
         <p className="mb-4 text-sm text-gray-400">
            The following settings are conceptually configured on the Hubbard Windows Agent. They are displayed here for informational purposes based on standard deployment documentation.
        </p>
        <div className="border-t border-gray-700">
           <dl className="divide-y divide-gray-700">
            {renderConfigItem('Hubbard Data Path', 'D:\\JHA\\lcs_data', false, "Path to the core Hubbard data files (.dat).")}
            {renderConfigItem('Hubbard Binaries Path', 'D:\\JHA\\bin', false, "Path to Hubbard utilities like vutil32.exe.")}
            {renderConfigItem('Hubbard Log File Path', 'D:\\JHA\\logs\\system.log', false, "Location of the main system log file.")}
            {renderConfigItem('AcuServer Port Range', '6000-6100', false, "The range of ports the agent scans for user sessions.")}
          </dl>
        </div>
      </Card>
    </div>
  );
};
