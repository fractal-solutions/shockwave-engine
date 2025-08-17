import React, { useRef, useEffect, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { TransformControls } from 'three-stdlib';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../state/store';
import { SceneObject, updateObjectProperties } from '../state/sceneSlice';

// A simple factory to create Three.js objects from our serializable format
const createThreeObject = (obj: SceneObject): THREE.Mesh | null => {
  let geometry;
  switch (obj.properties.geometry.type) {
    case 'BoxGeometry':
      geometry = new THREE.BoxGeometry(
        obj.properties.geometry.width,
        obj.properties.geometry.height,
        obj.properties.geometry.depth
      );
      break;
    case 'SphereGeometry':
      geometry = new THREE.SphereGeometry(
        obj.properties.geometry.radius,
        obj.properties.geometry.widthSegments,
        obj.properties.geometry.heightSegments
      );
      break;
    case 'BufferGeometry':
      geometry = new THREE.BufferGeometry();
      if (obj.properties.geometry.attributes.position) {
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(obj.properties.geometry.attributes.position), 3));
      }
      if (obj.properties.geometry.attributes.normal) {
        geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(obj.properties.geometry.attributes.normal), 3));
      }
      if (obj.properties.geometry.attributes.uv) {
        geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(obj.properties.geometry.attributes.uv), 2));
      }
      if (obj.properties.geometry.index) {
        geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(obj.properties.geometry.index), 1));
      }
      break;
    default:
      return null;
  }

  let material;
  switch (obj.properties.material.type) {
    case 'MeshStandardMaterial':
      material = new THREE.MeshStandardMaterial({ color: obj.properties.material.color });
      break;
    case 'MeshBasicMaterial':
      material = new THREE.MeshBasicMaterial({
        color: obj.properties.material.color,
        transparent: obj.properties.material.transparent || false,
        opacity: obj.properties.material.opacity || 1,
      });
      break;
    default:
      return null;
  }

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(obj.properties.position.x, obj.properties.position.y, obj.properties.position.z);
  mesh.rotation.set(obj.properties.rotation.x, obj.properties.rotation.y, obj.properties.rotation.z);
  mesh.scale.set(obj.properties.scale.x, obj.properties.scale.y, obj.properties.scale.z);
  mesh.name = obj.id; // Use the Redux object ID as the mesh name for tracking

  return mesh;
};

const ViewportPanel = React.forwardRef((props, ref) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneObjects = useSelector((state: RootState) => state.scene.objects);
  const selectedObjects = useSelector((state: RootState) => state.scene.selectedObjects);
  const dispatch = useDispatch<AppDispatch>();

  // Use a ref to hold the Three.js scene so it persists across re-renders
  const sceneRef = useRef<THREE.Scene>(new THREE.Scene());
  const meshMapRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const controlsRef = useRef<TransformControls | null>(null);

  // Expose getMesh method via ref
  useImperativeHandle(ref, () => ({
    getMesh: (id: string) => {
      const mesh = meshMapRef.current.get(id);
      console.log('Viewport: getMesh called for:', id, mesh);
      return mesh;
    },
  }));

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    sceneRef.current.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    sceneRef.current.add(directionalLight);

    // TransformControls setup
    const controls = new TransformControls(camera, renderer.domElement);
    sceneRef.current.add(controls);
    controlsRef.current = controls;

    // Event listeners for controls
    controls.addEventListener('change', () => renderer.render(sceneRef.current, camera));
    controls.addEventListener('objectChange', (event) => {
      const transformedObject = event.target.object;
      if (transformedObject && transformedObject.name) {
        dispatch(updateObjectProperties({
          id: transformedObject.name,
          properties: {
            position: { x: transformedObject.position.x, y: transformedObject.position.y, z: transformedObject.position.z },
            rotation: { x: transformedObject.rotation.x, y: transformedObject.rotation.y, z: transformedObject.rotation.z },
            scale: { x: transformedObject.scale.x, y: transformedObject.scale.y, z: transformedObject.scale.z },
          },
        }));
      }
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(sceneRef.current, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      currentMount.removeChild(renderer.domElement);
      sceneRef.current.remove(controls);
      controls.dispose();
    };
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    const currentMeshMap = meshMapRef.current;
    const existingIds = Array.from(currentMeshMap.keys());
    const newIds = Object.keys(sceneObjects);

    // Remove objects that are no longer in the Redux state
    existingIds.forEach(id => {
      if (!newIds.includes(id)) {
        const objectToRemove = currentMeshMap.get(id);
        if (objectToRemove) {
          scene.remove(objectToRemove);
          currentMeshMap.delete(id);
        }
      }
    });

    // Add or update objects from the Redux state
    newIds.forEach(id => {
      if (!currentMeshMap.has(id)) { // Only add if not already in the map
        const newObject = createThreeObject(sceneObjects[id]);
        if (newObject) {
          scene.add(newObject);
          currentMeshMap.set(id, newObject);
          console.log('Viewport: Mesh added to map:', id, newObject); 
        }
      } else { // Object already exists, update its properties
        const existingMesh = currentMeshMap.get(id);
        if (existingMesh) {
          const { position, rotation, scale } = sceneObjects[id].properties;
          existingMesh.position.set(position.x, position.y, position.z);
          existingMesh.rotation.set(rotation.x, rotation.y, rotation.z);
          existingMesh.scale.set(scale.x, scale.y, scale.z);
        }
      }
    });

    // Attach/detach controls based on selection
    if (controlsRef.current) {
      if (selectedObjects.length === 1) {
        const selectedMeshId = selectedObjects[0];
        const selectedMesh = meshMapRef.current.get(selectedMeshId);
        if (selectedMesh) {
          controlsRef.current.attach(selectedMesh);
        } else {
          controlsRef.current.detach();
        }
      } else {
        controlsRef.current.detach();
      }
    }

  }, [sceneObjects, selectedObjects, dispatch]);

  return <div ref={mountRef} className="h-full w-full" />;
});

export default ViewportPanel;
