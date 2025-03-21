import React from 'react';

interface CapsuleToggleProps<T extends string> {
  tabs: T[];
  activeTab: T;
  onChange: (value: T) => void;
}

export function CapsuleToggle<T extends string>({ 
  tabs,
  activeTab,
  onChange
}: CapsuleToggleProps<T>) {
  return (
    <div className="inline-flex bg-blue-900 p-1 rounded-full">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`px-4 py-2 rounded-full transition-all ${
            activeTab === tab
              ? 'bg-cyan-50 text-blue-900 shadow-sm'
              : 'text-cyan-50 hover:text-white'
          }`}
          onClick={() => onChange(tab)}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1).toLowerCase()}
        </button>
      ))}
    </div>
  );
} 