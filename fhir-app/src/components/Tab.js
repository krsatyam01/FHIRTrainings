import React from 'react';

function Tabs({ tabs, activeTab, onTabChange }) {
  return (
    <nav className="flex flex-wrap justify-center gap-2 mb-8 border-b pb-4">
      {tabs.map(tab => (
        <button
          key={tab.id}
          data-section={tab.id}
          className={`px-4 py-2 rounded-md font-semibold transition-colors duration-200
            ${activeTab === tab.id
              ? 'bg-teal-600 text-white'
              : 'bg-slate-200 text-slate-600'
            }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

export default Tabs;
