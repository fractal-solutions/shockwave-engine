import React from 'react';

const TerrainPanel: React.FC = () => {
  return (
    <div className="h-full w-full bg-gray-700 p-2 overflow-auto">
      <h2 className="text-lg font-bold mb-2">Terrain Editor</h2>
      <p className="text-sm">Sculpting and painting tools.</p>
    </div>
  );
};

export default TerrainPanel;
