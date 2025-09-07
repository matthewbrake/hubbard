import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/views/DashboardView';
import { SessionManagerView } from './components/views/SessionManagerView';
import { MaintenanceView } from './components/views/MaintenanceView';
import { LogView } from './components/views/LogView';
import { SettingsView } from './components/views/SettingsView';
import { PerformanceView } from './components/views/PerformanceView';
import type { ViewType } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');

  const renderView = useCallback(() => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'sessions':
        return <SessionManagerView />;
      case 'maintenance':
        return <MaintenanceView />;
      case 'performance':
        return <PerformanceView />;
      case 'logs':
        return <LogView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  }, [activeView]);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200 font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentView={activeView} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-800 p-4 sm:p-6 lg:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
