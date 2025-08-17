import React from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';

// Import placeholder panels
import HierarchyPanel from './panels/HierarchyPanel';
import InspectorPanel from './panels/InspectorPanel';
import AssetsPanel from './panels/AssetsPanel';
import ViewportPanel from './panels/ViewportPanel';
import ConsolePanel from './panels/ConsolePanel';
import ProfilerPanel from './panels/ProfilerPanel';
import TerrainPanel from './panels/TerrainPanel';
import ModelMakerPanel from './panels/ModelMakerPanel';
import ParticleGraphPanel from './panels/ParticleGraphPanel';
import ScriptEditorPanel from './panels/ScriptEditorPanel';
import StorylinePanel from './panels/StorylinePanel';

function App() {
  return (
    <div className="flex flex-col h-screen w-screen bg-gray-800 text-white">
      {/* Top Bar (Placeholder) */}
      <div className="h-10 bg-gray-900 flex items-center px-4 text-sm font-bold">
        Shockwave Editor
      </div>

      <PanelGroup direction="horizontal" className="flex-grow">
        <Panel defaultSize={15} minSize={10}>
          <HierarchyPanel />
        </Panel>
        <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-blue-500 cursor-ew-resize" />
        <Panel defaultSize={70} minSize={30}>
          <PanelGroup direction="vertical">
            <Panel defaultSize={70} minSize={30}>
              <ViewportPanel />
            </Panel>
            <PanelResizeHandle className="h-1 bg-gray-700 hover:bg-blue-500 cursor-ns-resize" />
            <Panel defaultSize={30} minSize={10}>
              <PanelGroup direction="horizontal">
                <Panel defaultSize={50} minSize={20}>
                  <ConsolePanel />
                </Panel>
                <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-blue-500 cursor-ew-resize" />
                <Panel defaultSize={50} minSize={20}>
                  <AssetsPanel />
                </Panel>
              </PanelGroup>
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-blue-500 cursor-ew-resize" />
        <Panel defaultSize={15} minSize={10}>
          <InspectorPanel />
        </Panel>
      </PanelGroup>
    </div>
  );
}

export default App;
