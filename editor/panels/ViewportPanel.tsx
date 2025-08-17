import React, { useRef, useEffect } from 'react';

const ViewportPanel: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mountRef.current) {
      // Initialize Three.js scene here later
      console.log("Viewport mounted, Three.js canvas will go here.");
    }
  }, []);

  return (
    <div ref={mountRef} className="h-full w-full bg-gray-800 flex items-center justify-center">
      <p className="text-xl text-gray-500">3D Viewport</p>
    </div>
  );
};

export default ViewportPanel;
