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
  physics: {
    isPhysicsBody: boolean;
    mass: number;
    friction: number; // Body friction
    restitution: number; // Body restitution
    materialFriction: number; // Material friction
    materialRestitution: number; // Material restitution
    collisionGroup: number; // Bitmask for collision group
    collisionMask: number; // Bitmask for collision mask
  };
}

const CollisionGroups = {
  DEFAULT: 1,
  PLAYER: 2,
  ENVIRONMENT: 4,
  // Add more as needed
};

// Define the initial state
export interface SceneState {
  objects: Record<string, SceneObject>;
  selectedObjects: string[];
}

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
      const baseObject: Omit<SceneObject, 'id'> = {
        name: 'Object',
        type: 'Mesh',
        properties: {
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          geometry: { type: 'BoxGeometry' },
          material: { type: 'MeshStandardMaterial', color: '#ffffff' },
        },
        physics: {
          isPhysicsBody: false,
          mass: 1,
          friction: 0.5,
          restitution: 0.2,
          materialFriction: 0.5,
          materialRestitution: 0.2,
          collisionGroup: CollisionGroups.DEFAULT,
          collisionMask: CollisionGroups.DEFAULT | CollisionGroups.PLAYER | CollisionGroups.ENVIRONMENT,
        },
      };

      const newObject: SceneObject = {
        id,
        ...baseObject,
        ...action.payload,
        properties: {
          ...baseObject.properties,
          ...action.payload.properties,
          position: { ...baseObject.properties.position, ...action.payload.properties?.position },
          rotation: { ...baseObject.properties.rotation, ...action.payload.properties?.rotation },
          scale: { ...baseObject.properties.scale, ...action.payload.properties?.scale },
        },
        physics: {
          ...baseObject.physics,
          ...action.payload.physics,
        },
      };

      if (!['Mesh', 'Light', 'Camera'].includes(newObject.type)) {
        newObject.type = 'Mesh';
      }

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
        state.selectedObjects = state.selectedObjects.filter((selectedId: string) => selectedId !== id);
      } else {
        state.selectedObjects = [...state.selectedObjects, id];
      }
    },
    clearSelection: (state) => {
      state.selectedObjects = [];
    },
    updateObjectProperties: (state, action: PayloadAction<{ id: string; properties?: Partial<SceneObject['properties']>; physics?: Partial<SceneObject['physics']> }>) => {
      const { id, properties, physics } = action.payload;
      if (state.objects[id]) {
        if (properties) {
          state.objects[id].properties = {
            ...state.objects[id].properties,
            ...properties,
            position: { ...state.objects[id].properties.position, ...properties.position },
            rotation: { ...state.objects[id].properties.rotation, ...properties.rotation },
            scale: { ...state.objects[id].properties.scale, ...properties.scale },
          };
        }
        if (physics) {
          state.objects[id].physics = {
            ...state.objects[id].physics,
            ...physics,
          };
        }
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
