import { System, World } from '@shockwave/ecs';
import { Vec3, Quat } from '@shockwave/math';
export interface RayHit {
    entity: number;
    point: Vec3;
    normal: Vec3;
    distance: number;
}
export interface BodyDesc {
    mass: number;
    position: Vec3;
    quaternion: Quat;
    shape: 'box' | 'sphere' | 'capsule' | 'mesh';
    halfExtents?: Vec3;
    radius?: number;
    height?: number;
    mesh?: any;
}
export interface PhysicsAdapter {
    addBody(entity: number, desc: BodyDesc): void;
    removeBody(entity: number): void;
    raycast(origin: Vec3, direction: Vec3, maxDistance: number): RayHit | null;
    setGravity(gravity: Vec3): void;
    step(deltaTime: number): void;
}
export declare class PhysicsSystem implements System {
    priority: number;
    private adapter;
    init(world: World): void;
    update(world: World, dt: number): void;
}
