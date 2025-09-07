import React from 'react';
import type { ViewType } from '../../types';
import { DashboardIcon, UsersIcon, WrenchScrewdriverIcon, DocumentTextIcon, CogIcon, ChartBarIcon } from '../ui/Icons';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

interface NavItemProps {
  icon: JSX.Element;
  label: string;
  view: ViewType;
  activeView: ViewType;
  onClick: (view: ViewType) => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, view, activeView, onClick }) => (
  <button
    onClick={() => onClick(view)}
    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
      activeView === view
        ? 'bg-blue-600 text-white shadow-lg'
        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
    }`}
    aria-current={activeView === view ? 'page' : undefined}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const navItems: { icon: JSX.Element; label: string; view: ViewType }[] = [
    { icon: <DashboardIcon />, label: 'Dashboard', view: 'dashboard' },
    { icon: <UsersIcon />, label: 'Session Manager', view: 'sessions' },
    { icon: <WrenchScrewdriverIcon />, label: 'Maintenance', view: 'maintenance' },
    { icon: <ChartBarIcon />, label: 'Performance', view: 'performance' },
    { icon: <DocumentTextIcon />, label: 'Logs', view: 'logs' },
  ];
  
  const bottomNavItems: { icon: JSX.Element; label: string; view: ViewType }[] = [
    { icon: <CogIcon />, label: 'Settings', view: 'settings' },
  ];

  return (
    <aside className="flex flex-col w-64 bg-gray-900 border-r border-gray-700 p-4">
      <div className="flex items-center justify-center h-16 mb-4">
        <h1 className="text-2xl font-bold text-white tracking-wider">HUBBARD</h1>
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavItem
            key={item.view}
            icon={item.icon}
            label={item.label}
            view={item.view}
            activeView={activeView}
            onClick={setActiveView}
          />
        ))}
      </nav>
       <div className="mt-auto space-y-2">
         {bottomNavItems.map((item) => (
            <NavItem
                key={item.view}
                icon={item.icon}
                label={item.label}
                view={item.view}
                activeView={activeView}
                onClick={setActiveView}
            />
         ))}
        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-800">
            <p>System Monitor v1.1</p>
        </div>
      </div>
    </aside>
  );
};
