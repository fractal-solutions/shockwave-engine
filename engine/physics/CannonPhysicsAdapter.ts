import { PhysicsAdapter, BodyDesc, RayHit } from './PhysicsSystem';
import { World } from '@shockwave/ecs';
import { CANNON } from '../index';

import { Vec3, Quat, Vector3 } from '@shockwave/math';

export class CannonPhysicsAdapter implements PhysicsAdapter {
  private world: CANNON.World;
  private bodies = new Map<number, CANNON.Body>();

  constructor() {
    this.world = new CANNON.World();
    this.world.gravity.set(0, -9.82, 0); // Default gravity
  }

  addBody(entityId: number, desc: BodyDesc): void {
    let shape: CANNON.Shape;
    switch (desc.shape) {
      case 'box':
        if (!desc.halfExtents) throw new Error("Box shape requires halfExtents.");
        shape = new CANNON.Box(new CANNON.Vec3(desc.halfExtents.x, desc.halfExtents.y, desc.halfExtents.z));
        break;
      case 'sphere':
        if (!desc.radius) throw new Error("Sphere shape requires radius.");
        shape = new CANNON.Sphere(desc.radius);
        break;
      case 'capsule':
        if (!desc.radius || !desc.height) throw new Error("Capsule shape requires radius and height.");
        // Cannon.js doesn't have a direct Capsule shape. It's usually composed of a cylinder and two spheres.
        // For simplicity, we'll use a Cylinder for now and note this limitation.
        shape = new CANNON.Cylinder(desc.radius, desc.radius, desc.height, 20); // 20 segments
        break;
      case 'mesh':
        // This would involve converting Three.js geometry to Cannon.js Trimesh or ConvexPolyhedron
        // For now, we'll throw an error or use a placeholder shape.
        throw new Error("Mesh shapes are not yet supported.");
      default:
        throw new Error(`Unknown shape type: ${desc.shape}`);
    }

    const body = new CANNON.Body({
      mass: desc.mass,
      position: new CANNON.Vec3(desc.position.x, desc.position.y, desc.position.z),
      quaternion: new CANNON.Quaternion(desc.quaternion.x, desc.quaternion.y, desc.quaternion.z, desc.quaternion.w),
      shape: shape,
    });

    this.world.addBody(body);
    this.bodies.set(entityId, body);
  }

  removeBody(entityId: number): void {
    const body = this.bodies.get(entityId);
    if (body) {
      this.world.removeBody(body);
      this.bodies.delete(entityId);
    }
  }

  raycast(origin: Vec3, direction: Vec3, maxDistance: number): RayHit | null {
    const from = new CANNON.Vec3(origin.x, origin.y, origin.z);
    const to = new CANNON.Vec3(origin.x + direction.x * maxDistance, origin.y + direction.y * maxDistance, origin.z + direction.z * maxDistance);
    const result = new CANNON.RaycastResult();
    this.world.raycastClosest(from, to, { skipBackfaces: true }, result);

    if (result.hasHit) {
      return {
        entity: -1, // We need a way to map Cannon.Body to ECS Entity ID
        point: new Vector3(result.hitPointWorld.x, result.hitPointWorld.y, result.hitPointWorld.z),
        normal: new Vector3(result.hitNormalWorld.x, result.hitNormalWorld.y, result.hitNormalWorld.z),
        distance: result.distance,
      };
    }
    return null;
  }

  setGravity(gravity: Vec3): void {
    this.world.gravity.set(gravity.x, gravity.y, gravity.z);
  }

  step(deltaTime: number): void {
    this.world.step(1 / 60, deltaTime, 3); // Fixed time step, max sub steps
  }

  // Helper to get Cannon.Body for a given entity (for internal use by PhysicsSystem)
  public getBody(entityId: number): CANNON.Body | undefined {
    return this.bodies.get(entityId);
  }
}
