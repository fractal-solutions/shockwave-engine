import { System, World } from '@shockwave/ecs';
import { Vec3, Quat } from '@shockwave/math';
import { PhysicsBodyComponent, TransformComponent } from '../components';

import { CannonPhysicsAdapter } from './CannonPhysicsAdapter';
import * as CANNON from 'cannon-es';

export interface RayHit {
  entity: number;
  point: Vec3;
  normal: Vec3;
  distance: number;
}

export interface BodyDesc {
  mass: number;
  position: Vec3;
  quaternion: Quat; // Corrected to Quat
  shape: 'box' | 'sphere' | 'capsule' | 'mesh';
  halfExtents?: Vec3;
  radius?: number;
  height?: number;
  mesh?: any; // Placeholder for Three.js Geometry or similar
}

export interface PhysicsAdapter {
  addBody(entity: number, desc: BodyDesc): void;
  removeBody(entity: number): void;
  raycast(origin: Vec3, direction: Vec3, maxDistance: number): RayHit | null;
  setGravity(gravity: Vec3): void;
  step(deltaTime: number): void;
  getBody(entityId: number): CANNON.Body | undefined; // Corrected return type
}

export class PhysicsSystem implements System {
  priority: number = 10;
  private adapter: PhysicsAdapter;

  constructor() {
    this.adapter = new CannonPhysicsAdapter();
  }

  init(world: World): void {
    console.log("PhysicsSystem initialized.");
  }

  update(world: World, dt: number): void {
    this.adapter.step(dt);

    const entities = world.query({
      all: [PhysicsBodyComponent, TransformComponent],
    });

    for (const entity of entities) {
      const transform = world.getComponent(entity, TransformComponent) as TransformComponent;
      const physicsBody = world.getComponent(entity, PhysicsBodyComponent) as PhysicsBodyComponent;

      if (transform && physicsBody) {
        const body = this.adapter.getBody(entity);
        if (body) {
          transform.position.set(body.position.x, body.position.y, body.position.z);
          transform.rotation.set(body.quaternion.x, body.quaternion.y, body.quaternion.z, body.quaternion.w);
        }
      }
    }
  }

  public addPhysicsBody(entity: number, desc: BodyDesc): void {
    this.adapter.addBody(entity, desc);
  }

  public setGravity(gravity: Vec3): void {
    this.adapter.setGravity(gravity);
  }

  public getBody(entityId: number): CANNON.Body | undefined {
    return this.adapter.getBody(entityId);
  }
}
