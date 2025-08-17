import React from 'react';

const ProfilerPanel: React.FC = () => {
  return (
    <div className="h-full w-full bg-gray-700 p-2 overflow-auto">
      <h2 className="text-lg font-bold mb-2">Profiler</h2>
      <p className="text-sm">Performance metrics will be displayed here.</p>
    </div>
  );
};

export default ProfilerPanel;
