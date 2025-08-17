import React from 'react';

const ConsolePanel: React.FC = () => {
  return (
    <div className="h-full w-full bg-gray-700 p-2 overflow-auto">
      <h2 className="text-lg font-bold mb-2">Console</h2>
      <p className="text-sm">Log messages will appear here.</p>
    </div>
  );
};

export default ConsolePanel;
