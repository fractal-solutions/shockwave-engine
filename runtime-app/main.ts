import { Engine, World } from '@shockwave/engine';
import { TransformComponent, RenderableComponent, PhysicsBodyComponent, PhysicsBodyType, PhysicsShapeType, PlayerControllerComponent } from '../engine/components';
import { PhysicsSystem } from '../engine/physics/PhysicsSystem';
import { Vector3 } from 'three';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
  if (!canvas) {
    console.error("Canvas element with ID 'gameCanvas' not found.");
    return;
  }

  // Create a new ECS world
  const world = new World();

  // Create and start the the engine
  const engine = new Engine(world, canvas);

  // Request pointer lock on canvas click
  canvas.addEventListener('click', () => {
    engine.inputSystem.requestPointerLock();
  });

  // Defer physics system retrieval and entity creation to ensure systems are initialized
  setTimeout(() => {
    engine.start(); // Start the engine here

    const physicsSystem = engine.physicsSystem;
    // if (!physicsSystem) { // No need for this check anymore
    //   console.error("PhysicsSystem not found!");
    //   return;
    // }

    console.log("Shockwave Runtime App Started!");

    // Example: Add a simple entity to the world
    const boxEntity = world.createEntity();
    console.log("Created entity:", boxEntity);
    world.addComponent(boxEntity, new TransformComponent());
    console.log("Added TransformComponent to entity:", boxEntity);
    world.addComponent(boxEntity, new RenderableComponent('box'));
    console.log("Added RenderableComponent to entity:", boxEntity);

    // Add a physics-enabled entity
    const physicsBoxEntity = world.createEntity();
    console.log("Created physics entity:", physicsBoxEntity);
    const physicsBoxTransform = new TransformComponent();
    physicsBoxTransform.position.set(0, 5, 0); // Start above the floor
    world.addComponent(physicsBoxEntity, physicsBoxTransform);
    world.addComponent(physicsBoxEntity, new RenderableComponent('physicsBox'));
    const physicsBoxBodyComponentData = {
      bodyType: PhysicsBodyType.DYNAMIC,
      mass: 1,
      shape: PhysicsShapeType.BOX,
      halfExtents: new Vector3(0.5, 0.5, 0.5),
    };
    world.addComponent(physicsBoxEntity, new PhysicsBodyComponent(physicsBoxBodyComponentData));
    physicsSystem.addPhysicsBody(physicsBoxEntity, {
      ...physicsBoxBodyComponentData,
      position: physicsBoxTransform.position,
      quaternion: physicsBoxTransform.rotation,
    });
    console.log("Added physics components to entity:", physicsBoxEntity);

    // Add a static floor
    const floorEntity = world.createEntity();
    console.log("Created floor entity:", floorEntity);
    const floorTransform = new TransformComponent();
    floorTransform.position.set(0, -2, 0);
    floorTransform.scale.set(10, 0.5, 10);
    world.addComponent(floorEntity, floorTransform);
    world.addComponent(floorEntity, new RenderableComponent('floor'));
    const floorBodyComponentData = {
      bodyType: PhysicsBodyType.STATIC,
      mass: 0,
      shape: PhysicsShapeType.BOX,
      halfExtents: new Vector3(5, 0.25, 5),
    };
    world.addComponent(floorEntity, new PhysicsBodyComponent(floorBodyComponentData));
    physicsSystem.addPhysicsBody(floorEntity, {
      ...floorBodyComponentData,
      position: floorTransform.position,
      quaternion: floorTransform.rotation,
    });
    console.log("Added floor components to entity:", floorEntity);

    // Create Player Entity
    const playerEntity = world.createEntity();
    console.log("Created player entity:", playerEntity);
    const playerTransform = new TransformComponent();
    playerTransform.position.set(0, 0.5, 5); // Start player slightly above ground
    world.addComponent(playerEntity, playerTransform);
    world.addComponent(playerEntity, new RenderableComponent('player')); // Visual representation
    world.addComponent(playerEntity, new PlayerControllerComponent());
    const playerBodyComponentData = {
      bodyType: PhysicsBodyType.DYNAMIC,
      mass: 70, // Player mass
      shape: PhysicsShapeType.CAPSULE,
      radius: 0.5,
      height: 1.0, // Total height 2 * radius + height
    };
    world.addComponent(playerEntity, new PhysicsBodyComponent(playerBodyComponentData));
    physicsSystem.addPhysicsBody(playerEntity, {
      ...playerBodyComponentData,
      position: playerTransform.position,
      quaternion: playerTransform.rotation,
    });
    console.log("Added player components to entity:", playerEntity);

    // You would typically load a scene from a JSON file here
  }, 0);
});