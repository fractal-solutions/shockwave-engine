import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
// Import placeholder panels
import HierarchyPanel from './panels/HierarchyPanel';
import InspectorPanel from './panels/InspectorPanel';
import AssetsPanel from './panels/AssetsPanel';
import ViewportPanel from './panels/ViewportPanel';
import ConsolePanel from './panels/ConsolePanel';
function App() {
    return (_jsxs("div", { className: "flex flex-col h-screen w-screen bg-gray-800 text-white", children: [_jsx("div", { className: "h-10 bg-gray-900 flex items-center px-4 text-sm font-bold", children: "Shockwave Editor" }), _jsxs(PanelGroup, { direction: "horizontal", className: "flex-grow", children: [_jsx(Panel, { defaultSize: 15, minSize: 10, children: _jsx(HierarchyPanel, {}) }), _jsx(PanelResizeHandle, { className: "w-1 bg-gray-700 hover:bg-blue-500 cursor-ew-resize" }), _jsx(Panel, { defaultSize: 70, minSize: 30, children: _jsxs(PanelGroup, { direction: "vertical", children: [_jsx(Panel, { defaultSize: 70, minSize: 30, children: _jsx(ViewportPanel, {}) }), _jsx(PanelResizeHandle, { className: "h-1 bg-gray-700 hover:bg-blue-500 cursor-ns-resize" }), _jsx(Panel, { defaultSize: 30, minSize: 10, children: _jsxs(PanelGroup, { direction: "horizontal", children: [_jsx(Panel, { defaultSize: 50, minSize: 20, children: _jsx(ConsolePanel, {}) }), _jsx(PanelResizeHandle, { className: "w-1 bg-gray-700 hover:bg-blue-500 cursor-ew-resize" }), _jsx(Panel, { defaultSize: 50, minSize: 20, children: _jsx(AssetsPanel, {}) })] }) })] }) }), _jsx(PanelResizeHandle, { className: "w-1 bg-gray-700 hover:bg-blue-500 cursor-ew-resize" }), _jsx(Panel, { defaultSize: 15, minSize: 10, children: _jsx(InspectorPanel, {}) })] })] }));
}
export default App;
