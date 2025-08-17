import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useEffect } from 'react';
const ViewportPanel = () => {
    const mountRef = useRef(null);
    useEffect(() => {
        if (mountRef.current) {
            // Initialize Three.js scene here later
            console.log("Viewport mounted, Three.js canvas will go here.");
        }
    }, []);
    return (_jsx("div", { ref: mountRef, className: "h-full w-full bg-gray-800 flex items-center justify-center", children: _jsx("p", { className: "text-xl text-gray-500", children: "3D Viewport" }) }));
};
export default ViewportPanel;
