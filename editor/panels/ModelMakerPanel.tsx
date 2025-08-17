import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addObject, removeObject, clearSelection, SceneObject } from '../state/sceneSlice';
import { AppDispatch, RootState } from '../state/store';
import { subtract, union, intersect } from '../../packages/csg';
import * as THREE from 'three';

const Button = ({ onClick, children, disabled = false }: { onClick: () => void; children: React.ReactNode; disabled?: boolean }) => (
  <button
    onClick={onClick}
    className={`bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded w-full text-left ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    }`}
    disabled={disabled}
  >
    {children}
  </button>
);

import { ViewportPanelRef } from './ViewportPanel';

interface ModelMakerPanelProps {
  viewportRef: React.RefObject<ViewportPanelRef>;
}

const ModelMakerPanel: React.FC<ModelMakerPanelProps> = ({ viewportRef }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedObjects } = useSelector((state: RootState) => state.scene);

  const handleAddCube = () => {
    console.log('Add Cube clicked');
    dispatch(
      addObject({
        name: 'Cube',
        type: 'Mesh',
        properties: {
          geometry: { type: 'BoxGeometry', width: 1, height: 1, depth: 1 },
          material: { type: 'MeshBasicMaterial', color: '#ffffff' },
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
        },
      })
    );
  };

  const handleAddSphere = () => {
    console.log('Add Sphere clicked');
    dispatch(
      addObject({
        name: 'Sphere',
        type: 'Mesh',
        properties: {
          geometry: { type: 'SphereGeometry', radius: 1, widthSegments: 32, heightSegments: 32 },
          material: { type: 'MeshBasicMaterial', color: '#ff0000', transparent: true, opacity: 0.5 }, // Red transparent sphere
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
        },
      })
    );
  };

  const handleCSGOperation = (operation: (meshA: THREE.Mesh, meshB: THREE.Mesh) => THREE.Mesh, operationName: string) => {
    if (selectedObjects.length !== 2) {
      console.warn(`Select exactly two objects for ${operationName}.`);
      return;
    }

    const [idA, idB] = selectedObjects;

    if (!viewportRef.current) {
      console.error('Viewport ref not available.');
      return;
    }

    const meshA = viewportRef.current.getMesh(idA);
    const meshB = viewportRef.current.getMesh(idB);

    if (!meshA || !meshB) {
      console.error('Selected meshes not found in viewport.', { idA, idB, meshA, meshB });
      return;
    }

    try {
      const resultMesh = operation(meshA, meshB);

      const geometryAttributes: { [key: string]: number[] } = {};
      for (const key in resultMesh.geometry.attributes) {
        const attribute = resultMesh.geometry.attributes[key];
        geometryAttributes[key] = Array.from(attribute.array as Float32Array);
      }
      const geometryIndex = resultMesh.geometry.index ? Array.from(resultMesh.geometry.index.array as Uint16Array | Uint32Array) : null;

      const newObjectData: Partial<SceneObject> = {
        name: `${operationName}(${meshA.name}, ${meshB.name})`,
        type: 'Mesh',
        properties: {
          position: { x: resultMesh.position.x, y: resultMesh.position.y, z: resultMesh.position.z },
          rotation: { x: resultMesh.rotation.x, y: resultMesh.rotation.y, z: resultMesh.rotation.z },
          scale: { x: resultMesh.scale.x, y: resultMesh.scale.y, z: resultMesh.scale.z },
          geometry: {
            type: 'BufferGeometry',
            attributes: geometryAttributes,
            index: geometryIndex,
          },
          material: { type: 'MeshBasicMaterial', color: '#00ff00' }, // Default green basic material
        },
      };

      dispatch(removeObject(idA));
      dispatch(removeObject(idB));
      dispatch(addObject(newObjectData));
      dispatch(clearSelection());

    } catch (error) {
      console.error(`CSG ${operationName} failed:`, error);
    }
  };

  const handleUnion = () => handleCSGOperation(union, 'Union');
  const handleSubtract = () => handleCSGOperation(subtract, 'Subtract');
  const handleIntersect = () => handleCSGOperation(intersect, 'Intersect');

  const isCSGOperationDisabled = selectedObjects.length !== 2;

  return (
    <div className="h-full w-full bg-gray-800 p-2 overflow-auto text-white">
      <h2 className="text-lg font-bold mb-4 border-b border-gray-600 pb-2">Model Maker</h2>
      
      <div className="space-y-2">
        <h3 className="text-md font-semibold">Primitives</h3>
        <Button onClick={handleAddCube}>Add Cube</Button>
        <Button onClick={handleAddSphere}>Add Sphere</Button>
        
        <h3 className="text-md font-semibold pt-4">CSG Operations</h3>
        <Button onClick={handleUnion} disabled={isCSGOperationDisabled}>Union</Button>
        <Button onClick={handleSubtract} disabled={isCSGOperationDisabled}>Subtract</Button>
        <Button onClick={handleIntersect} disabled={isCSGOperationDisabled}>Intersect</Button>
      </div>
    </div>
  );
};

export default ModelMakerPanel;

