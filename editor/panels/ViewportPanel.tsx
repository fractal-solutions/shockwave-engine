import React, { useRef, useEffect, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { TransformControls, OrbitControls } from 'three-stdlib';
import { CANNON } from '@shockwave/engine';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../state/store';
import { SceneObject, updateObjectProperties } from '../state/sceneSlice';

interface TransformControlsChangeEvent extends THREE.Event {
  type: 'change';
}

interface TransformControlsObjectChangeEvent extends THREE.Event {
  type: 'objectChange';
  target: TransformControls; // The TransformControls instance
  object: THREE.Object3D; // The object being transformed
}

interface TransformControlsDraggingChangedEvent extends THREE.Event {
  type: 'dragging-changed';
  value: boolean; // true if dragging started, false if dragging stopped
}

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

  return mesh || null;
};

export interface ViewportPanelRef {
  getMesh: (id: string) => THREE.Mesh | null;
}

const ViewportPanel = React.forwardRef<ViewportPanelRef, {}>((props, ref) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneObjects = useSelector((state: RootState) => state.scene.objects);
  const selectedObjects = useSelector((state: RootState) => state.scene.selectedObjects);
  const dispatch = useDispatch<AppDispatch>();

  // Use a ref to hold the Three.js scene so it persists across re-renders
  const sceneRef = useRef<THREE.Scene>(new THREE.Scene());
  const meshMapRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const controlsRef = useRef<TransformControls | null>(null);
  const orbitControlsRef = useRef<OrbitControls | null>(null);
  const physicsWorldRef = useRef<CANNON.World | null>(null);
  const cannonBodyMapRef = useRef<Map<string, CANNON.Body>>(new Map());
  const defaultMaterialRef = useRef<CANNON.Material | null>(null);

  // Expose getMesh method via ref
  useImperativeHandle(ref, () => ({
    getMesh: (id: string) => {
      const mesh = meshMapRef.current.get(id);
      console.log('Viewport: getMesh called for:', id, mesh);
      return mesh || null;
    },
  }));

  useEffect(() => {
    console.log('Initial useEffect running');
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // Physics world setup
    const physicsWorld = new CANNON.World();
    physicsWorld.gravity.set(0, -9.82, 0); // m/s^2
    physicsWorldRef.current = physicsWorld;

    // Default physics material
    const defaultMaterial = new CANNON.Material('default');
    console.log('defaultMaterial created:', defaultMaterial);
    defaultMaterialRef.current = defaultMaterial;
    console.log('defaultMaterialRef.current after assignment:', defaultMaterialRef.current);
    const defaultContactMaterial = new CANNON.ContactMaterial(
      defaultMaterial,
      defaultMaterial,
      {
        friction: 0.5,
        restitution: 0.2,
      }
    );
    physicsWorld.addContactMaterial(defaultContactMaterial);

    // Create a ground plane in Cannon.js
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({ mass: 0, shape: groundShape, material: defaultMaterial });
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // Rotate ground to be horizontal
    physicsWorld.addBody(groundBody);

    // Create a ground plane in Three.js
    const groundMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshStandardMaterial({ color: 0x808080, side: THREE.DoubleSide })
    );
    groundMesh.rotation.x = -Math.PI / 2;
    sceneRef.current.add(groundMesh);

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

    // OrbitControls setup
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true; // an animation loop is required when damping is enabled
    orbitControls.dampingFactor = 0.25;
    orbitControls.screenSpacePanning = false;
    orbitControls.maxPolarAngle = Math.PI / 2;
    orbitControlsRef.current = orbitControls;

    // Event listeners for controls
    (controls as any).addEventListener('change', (event: TransformControlsChangeEvent) => renderer.render(sceneRef.current, camera));
    (controls as any).addEventListener('objectChange', (event: TransformControlsObjectChangeEvent) => {
      const transformedObject = event.object;
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

    // Disable OrbitControls when TransformControls are active
    (controls as any).addEventListener('dragging-changed', (event: TransformControlsDraggingChangedEvent) => {
      orbitControls.enabled = !event.value;
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Step the physics world
      physicsWorld.step(1 / 60); // Update physics 60 times per second

      // Synchronize Three.js meshes with Cannon.js bodies
      cannonBodyMapRef.current.forEach((body, id) => {
        const mesh = meshMapRef.current.get(id);
        if (mesh) {
          mesh.position.copy(body.position as any); // Cannon.js Vec3 to Three.js Vector3
          mesh.quaternion.copy(body.quaternion as any); // Cannon.js Quaternion to Three.js Quaternion
        }
      });

      orbitControls.update(); // only required if controls.enableDamping is set to true
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
      orbitControls.dispose(); // Dispose OrbitControls
      // No explicit cleanup for physicsWorld needed as it's a ref and will be garbage collected
    };
  }, [CANNON]);

  useEffect(() => {
    console.log('sceneObjects useEffect running');
    const scene = sceneRef.current;
    const currentMeshMap = meshMapRef.current;
    const physicsWorld = physicsWorldRef.current;
    console.log('defaultMaterialRef.current at start of sceneObjects useEffect:', defaultMaterialRef.current);

    if (!physicsWorld || !defaultMaterialRef.current) {
      console.log("Physics world or default material not initialized yet.");
      return; // Wait for initialization
    }

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
        // Remove corresponding Cannon.js body
        const bodyToRemove = cannonBodyMapRef.current.get(id);
        if (bodyToRemove && physicsWorldRef.current) {
          physicsWorldRef.current.removeBody(bodyToRemove);
          cannonBodyMapRef.current.delete(id);
        }
      }
    });

    // Add or update objects from the Redux state
    newIds.forEach(id => {
      const sceneObject = sceneObjects[id];
      const physicsWorld = physicsWorldRef.current;

      if (!currentMeshMap.has(id)) { // Only add if not already in the map
        const newObject = createThreeObject(sceneObject);
        if (newObject) {
          scene.add(newObject);
          currentMeshMap.set(id, newObject);
          console.log('Viewport: Mesh added to map:', id, newObject);

          // Create Cannon.js body if it's a physics body
          if (sceneObject.physics.isPhysicsBody && physicsWorld) {
            const shape = new CANNON.Box(new CANNON.Vec3(sceneObject.properties.scale.x / 2, sceneObject.properties.scale.y / 2, sceneObject.properties.scale.z / 2));
            const bodyMaterial = new CANNON.Material();
            const contactMaterial = new CANNON.ContactMaterial(
              bodyMaterial,
              defaultMaterialRef.current!,
              {
                friction: sceneObject.physics.materialFriction,
                restitution: sceneObject.physics.materialRestitution,
              }
            );
            physicsWorld.addContactMaterial(contactMaterial);

            const body = new CANNON.Body({
              mass: sceneObject.physics.mass,
              position: new CANNON.Vec3(sceneObject.properties.position.x, sceneObject.properties.position.y, sceneObject.properties.position.z),
              shape: shape,
              material: bodyMaterial,
              collisionFilterGroup: sceneObject.physics.collisionGroup,
              collisionFilterMask: sceneObject.physics.collisionMask,
            });
            physicsWorld.addBody(body);
            cannonBodyMapRef.current.set(id, body);
          }
        }
      } else { // Object already exists, update its properties
        const existingMesh = currentMeshMap.get(id);
        const existingBody = cannonBodyMapRef.current.get(id);

        if (existingMesh) {
          const { position, rotation, scale } = sceneObject.properties;
          existingMesh.position.set(position.x, position.y, position.z);
          existingMesh.rotation.set(rotation.x, rotation.y, rotation.z);
          existingMesh.scale.set(scale.x, scale.y, scale.z);
        }

        // Update Cannon.js body properties
        if (existingBody) {
          if (sceneObject.physics.isPhysicsBody) {
            existingBody.mass = sceneObject.physics.mass;
            existingBody.position.set(sceneObject.properties.position.x, sceneObject.properties.position.y, sceneObject.properties.position.z);
            existingBody.quaternion.setFromEuler(sceneObject.properties.rotation.x, sceneObject.properties.rotation.y, sceneObject.properties.rotation.z);
            if (existingBody.material) {
              existingBody.material.friction = sceneObject.physics.materialFriction;
              existingBody.material.restitution = sceneObject.physics.materialRestitution;
            }
            existingBody.collisionFilterGroup = sceneObject.physics.collisionGroup;
            existingBody.collisionFilterMask = sceneObject.physics.collisionMask;
            existingBody.updateInertiaWorld();
          } else { // If it was a physics body but now it's not, remove it
            if (physicsWorld) {
              physicsWorld.removeBody(existingBody);
              cannonBodyMapRef.current.delete(id);
            }
          }
        } else if (sceneObject.physics.isPhysicsBody && physicsWorld) { // If it's a new physics body
          const shape = new CANNON.Box(new CANNON.Vec3(sceneObject.properties.scale.x / 2, sceneObject.properties.scale.y / 2, sceneObject.properties.scale.z / 2));

          const bodyMaterial = new CANNON.Material();
          const contactMaterial = new CANNON.ContactMaterial(
            bodyMaterial,
            defaultMaterialRef.current!,
            {
              friction: sceneObject.physics.materialFriction,
              restitution: sceneObject.physics.materialRestitution,
            }
          );
          physicsWorld.addContactMaterial(contactMaterial);

          const body = new CANNON.Body({
            mass: sceneObject.physics.mass,
            position: new CANNON.Vec3(sceneObject.properties.position.x, sceneObject.properties.position.y, sceneObject.properties.position.z),
            shape: shape,
            material: bodyMaterial,
            collisionFilterGroup: sceneObject.physics.collisionGroup,
            collisionFilterMask: sceneObject.physics.collisionMask,
          });
          physicsWorld.addBody(body);
          cannonBodyMapRef.current.set(id, body);
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

  }, [sceneObjects, selectedObjects, dispatch, CANNON]);

  return <div ref={mountRef} className="h-full w-full" />;
});

export default ViewportPanel;
