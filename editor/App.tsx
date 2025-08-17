import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './state/store';
import { loadScene } from './state/sceneSlice';

// Import panels
import HierarchyPanel from './panels/HierarchyPanel';
import InspectorPanel from './panels/InspectorPanel';
import AssetsPanel from './panels/AssetsPanel';
import ViewportPanel from './panels/ViewportPanel';
import ConsolePanel from './panels/ConsolePanel';
import ModelMakerPanel from './panels/ModelMakerPanel';

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors duration-200 ${
      active
        ? 'border-blue-500 text-white'
        : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-700'
    }`}
  >
    {children}
  </button>
);

const BottomPanel = ({ viewportRef }) => {
  const [activeTab, setActiveTab] = useState('Model Maker');

  return (
    <div className="h-full flex flex-col bg-gray-800 rounded-md overflow-hidden">
      {/* Tab Headers */}
      <div className="flex-shrink-0 border-b border-gray-700 bg-gray-900 flex">
        <TabButton active={activeTab === 'Model Maker'} onClick={() => setActiveTab('Model Maker')}>Model Maker</TabButton>
        <TabButton active={activeTab === 'Console'} onClick={() => setActiveTab('Console')}>Console</TabButton>
        <TabButton active={activeTab === 'Assets'} onClick={() => setActiveTab('Assets')}>Assets</TabButton>
      </div>
      
      {/* Tab Content */}
      <div className="flex-grow p-4 overflow-auto">
        {activeTab === 'Model Maker' && <ModelMakerPanel viewportRef={viewportRef} />}
        {activeTab === 'Console' && <ConsolePanel />}
        {activeTab === 'Assets' && <AssetsPanel />}
      </div>
    </div>
  );
};

function App() {
  const viewportRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sceneObjects = useSelector((state: RootState) => state.scene.objects);
  const dispatch = useDispatch<AppDispatch>();

  const handleSave = () => {
    const data = JSON.stringify(sceneObjects, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shockwave_scene.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoad = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const loadedData = JSON.parse(e.target?.result as string);
        // Basic validation: check if it looks like a scene object map
        if (typeof loadedData === 'object' && loadedData !== null && !Array.isArray(loadedData)) {
          dispatch(loadScene(loadedData));
        } else {
          console.error('Loaded JSON is not a valid scene format.');
        }
      } catch (error) {
        console.error('Failed to parse JSON file:', error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-900 text-white font-sans">
      {/* Top Bar */}
      <div className="h-12 flex-shrink-0 flex items-center px-6 text-lg font-bold border-b border-gray-700 bg-gray-800 shadow-md">
        <span className="text-blue-400">Shockwave</span> Editor
        <div className="flex-grow"></div>
        <button onClick={handleSave} className="ml-4 px-4 py-2 text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-700 transition-colors duration-200">Save</button>
        <button onClick={handleLoad} className="ml-2 px-4 py-2 text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-700 transition-colors duration-200">Load</button>
        <input type="file" ref={fileInputRef} onChange={onFileChange} accept=".json" className="hidden" />
      </div>

      {/* Main Content Area */}
      <div className="flex-grow grid grid-cols-[280px_1fr_280px] grid-rows-[2fr_1fr] gap-3 bg-gray-900 p-3">
        {/* Hierarchy Panel */}
        <div className="col-span-1 row-span-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <HierarchyPanel />
        </div>
        
        {/* Viewport Panel */}
        <div className="col-span-1 row-span-1 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <ViewportPanel ref={viewportRef} />
        </div>
        
        {/* Inspector Panel */}
        <div className="col-span-1 row-span-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <InspectorPanel />
        </div>
        
        {/* Bottom Panel (Tabs) */}
        <div className="col-span-1 row-span-1 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <BottomPanel viewportRef={viewportRef} />
        </div>
      </div>
    </div>
  );
}

export default App;
