import React from 'react';

const HierarchyPanel: React.FC = () => {
  return (
    <div className="h-full w-full bg-gray-700 p-2 overflow-auto">
      <h2 className="text-lg font-bold mb-2">Hierarchy</h2>
      <ul className="text-sm">
        <li>Entity 1</li>
        <li>Entity 2</li>
        <li>Entity 3</li>
      </ul>
    </div>
  );
};

export default HierarchyPanel;
