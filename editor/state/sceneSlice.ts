import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

// Define the structure of a scene object
export interface SceneObject {
  id: string;
  name: string;
  type: 'Mesh' | 'Light' | 'Camera';
  properties: {
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    scale: { x: number; y: number; z: number };
    geometry: { type: string; [key: string]: any }; // e.g., { type: 'BoxGeometry', width: 1, height: 1, depth: 1 }
    material: { type: string; [key: string]: any }; // e.g., { type: 'MeshStandardMaterial', color: '#ffffff' }
  };
}

// Define the state shape
interface SceneState {
  objects: Record<string, SceneObject>;
  selectedObjects: string[];
}

// Define the initial state
const initialState: SceneState = {
  objects: {},
  selectedObjects: [],
};

const sceneSlice = createSlice({
  name: 'scene',
  initialState,
  reducers: {
    addObject: (state, action: PayloadAction<Omit<SceneObject, 'id'> | Partial<SceneObject>>) => {
      const id = uuidv4();
      const newObject: SceneObject = {
        id,
        name: 'Object',
        type: 'Mesh',
        ...action.payload,
        properties: {
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          ...action.payload.properties,
        },
      };
      state.objects[id] = newObject;
    },
    removeObject: (state, action: PayloadAction<string>) => {
      delete state.objects[action.payload];
    },
    setSelection: (state, action: PayloadAction<string[]>) => {
      state.selectedObjects = action.payload;
    },
    toggleSelection: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.selectedObjects.includes(id)) {
        state.selectedObjects = state.selectedObjects.filter(selectedId => selectedId !== id);
      } else {
        state.selectedObjects = [...state.selectedObjects, id];
      }
    },
    clearSelection: (state) => {
      state.selectedObjects = [];
    },
    updateObjectProperties: (state, action: PayloadAction<{ id: string; properties: Partial<SceneObject['properties']> }>) => {
      const { id, properties } = action.payload;
      if (state.objects[id]) {
        state.objects[id].properties = {
          ...state.objects[id].properties,
          ...properties,
          position: { ...state.objects[id].properties.position, ...properties.position },
          rotation: { ...state.objects[id].properties.rotation, ...properties.rotation },
          scale: { ...state.objects[id].properties.scale, ...properties.scale },
        };
      }
    },
    loadScene: (state, action: PayloadAction<Record<string, SceneObject>>) => {
      state.objects = action.payload;
      state.selectedObjects = []; // Clear selection on load
    },
  },
});

export const { addObject, removeObject, setSelection, toggleSelection, clearSelection, updateObjectProperties, loadScene } = sceneSlice.actions;
export default sceneSlice.reducer;
