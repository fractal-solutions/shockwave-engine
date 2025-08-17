import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../state/store';
import { updateObjectProperties } from '../state/sceneSlice'; // Will create this action

const PropertyInput = ({ label, value, onChange, step = 1 }: { label: string; value: number; onChange: (value: number) => void; step?: number }) => (
  <div className="mb-2">
    <label className="block text-gray-400 text-xs font-bold mb-1">
      {label}
    </label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      step={step}
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600"
    />
  </div>
);

const InspectorPanel: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { objects, selectedObjects } = useSelector((state: RootState) => state.scene);

  const selectedObjectId = selectedObjects.length === 1 ? selectedObjects[0] : null;
  const selectedObject = selectedObjectId ? objects[selectedObjectId] : null;

  const handlePropertyChange = (property: 'position' | 'rotation' | 'scale', axis: 'x' | 'y' | 'z', value: number) => {
    if (!selectedObject) return;

    const updatedProperty = { ...selectedObject.properties[property], [axis]: value };

    dispatch(updateObjectProperties({
      id: selectedObject.id,
      properties: {
        ...selectedObject.properties,
        [property]: updatedProperty,
      },
    }));
  };

  const handlePhysicsChange = (property: string, value: boolean | number) => {
    if (!selectedObject) return;

    const newPhysics = { ...selectedObject.physics, [property]: value };

    dispatch(updateObjectProperties({ id: selectedObject.id, physics: newPhysics }));
  };

  if (!selectedObject) {
    return (
      <div className="h-full w-full bg-gray-800 p-4 overflow-auto text-white">
        <h2 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">Inspector</h2>
        <p className="text-sm text-gray-400">Select one object to inspect its properties.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-gray-800 p-4 overflow-auto text-white">
      <h2 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">Inspector</h2>
      <div className="mb-4">
        <p className="text-md font-semibold">Name: {selectedObject.name}</p>
        <p className="text-sm text-gray-400">ID: {selectedObject.id.substring(0, 8)}</p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-md font-semibold mb-2">Position</h3>
          <PropertyInput label="X" value={selectedObject.properties.position.x} onChange={(val) => handlePropertyChange('position', 'x', val)} />
          <PropertyInput label="Y" value={selectedObject.properties.position.y} onChange={(val) => handlePropertyChange('position', 'y', val)} />
          <PropertyInput label="Z" value={selectedObject.properties.position.z} onChange={(val) => handlePropertyChange('position', 'z', val)} />
        </div>

        <div>
          <h3 className="text-md font-semibold mb-2">Rotation (Radians)</h3>
          <PropertyInput label="X" value={selectedObject.properties.rotation.x} onChange={(val) => handlePropertyChange('rotation', 'x', val)} step={0.1} />
          <PropertyInput label="Y" value={selectedObject.properties.rotation.y} onChange={(val) => handlePropertyChange('rotation', 'y', val)} step={0.1} />
          <PropertyInput label="Z" value={selectedObject.properties.rotation.z} onChange={(val) => handlePropertyChange('rotation', 'z', val)} step={0.1} />
        </div>

        <div>
          <h3 className="text-md font-semibold mb-2">Scale</h3>
          <PropertyInput label="X" value={selectedObject.properties.scale.x} onChange={(val) => handlePropertyChange('scale', 'x', val)} />
          <PropertyInput label="Y" value={selectedObject.properties.scale.y} onChange={(val) => handlePropertyChange('scale', 'y', val)} />
          <PropertyInput label="Z" value={selectedObject.properties.scale.z} onChange={(val) => handlePropertyChange('scale', 'z', val)} />
        </div>
      <div>
          <h3 className="text-md font-semibold mb-2">Physics</h3>
          <div className="mb-2">
            <label className="block text-gray-400 text-xs font-bold mb-1">
              Is Physics Body
            </label>
            <input
              type="checkbox"
              checked={selectedObject.physics.isPhysicsBody}
              onChange={(e) => handlePhysicsChange('isPhysicsBody', e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
          </div>
          {selectedObject.physics.isPhysicsBody && (
            <>
              <PropertyInput label="Mass" value={selectedObject.physics.mass} onChange={(val) => handlePhysicsChange('mass', val)} step={0.1} />
              <PropertyInput label="Friction" value={selectedObject.physics.friction} onChange={(val) => handlePhysicsChange('friction', val)} step={0.01} />
              <PropertyInput label="Restitution" value={selectedObject.physics.restitution} onChange={(val) => handlePhysicsChange('restitution', val)} step={0.01} />
              <PropertyInput label="Material Friction" value={selectedObject.physics.materialFriction} onChange={(val) => handlePhysicsChange('materialFriction', val)} step={0.01} />
              <PropertyInput label="Material Restitution" value={selectedObject.physics.materialRestitution} onChange={(val) => handlePhysicsChange('materialRestitution', val)} step={0.01} />
              <PropertyInput label="Collision Group" value={selectedObject.physics.collisionGroup} onChange={(val) => handlePhysicsChange('collisionGroup', val)} step={1} />
              <PropertyInput label="Collision Mask" value={selectedObject.physics.collisionMask} onChange={(val) => handlePhysicsChange('collisionMask', val)} step={1} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InspectorPanel;
