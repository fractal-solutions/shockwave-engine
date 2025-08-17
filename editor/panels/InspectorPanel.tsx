import React from 'react';

const InspectorPanel: React.FC = () => {
  return (
    <div className="h-full w-full bg-gray-700 p-2 overflow-auto">
      <h2 className="text-lg font-bold mb-2">Inspector</h2>
      <p className="text-sm">Selected Entity Properties</p>
    </div>
  );
};

export default InspectorPanel;
