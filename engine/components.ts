import { Vector3, Quaternion } from 'three';

export type Vec3 = Vector3;
export type Quat = Quaternion;

// Base Component type for ECS
export interface IComponent {}

// Component types
export class TransformComponent implements IComponent {
  constructor(
    public position: Vec3 = new Vector3(),
    public rotation: Quat = new Quaternion(),
    public scale: Vec3 = new Vector3(1, 1, 1)
  ) {}
}

export class RenderableComponent implements IComponent {
  constructor(
    public modelPath: string,
    public materialPath?: string
  ) {}
}

export enum PhysicsBodyType {
  STATIC = 'static',
  DYNAMIC = 'dynamic',
  KINEMATIC = 'kinematic',
}

export enum PhysicsShapeType {
  BOX = 'box',
  SPHERE = 'sphere',
  CAPSULE = 'capsule',
  MESH = 'mesh',
}

export class PhysicsBodyComponent implements IComponent {
  constructor(
    public bodyType: PhysicsBodyType = PhysicsBodyType.DYNAMIC,
    public mass: number = 1,
    public shape: PhysicsShapeType = PhysicsShapeType.BOX,
    public halfExtents?: Vec3, // For BOX
    public radius?: number,    // For SPHERE, CAPSULE
    public height?: number,    // For CAPSULE
    public meshPath?: string   // For MESH
  ) {}
}

export class PlayerControllerComponent implements IComponent {
  constructor(
    public moveSpeed: number = 5,
    public jumpForce: number = 8,
    public airControl: number = 0.1,
    public crouchHeight: number = 0.5,
    public standHeight: number = 1.8,
    public slopeLimit: number = Math.PI / 4 // 45 degrees
  ) {}
}

export class CameraComponent implements IComponent {
  constructor(
    public fov: number = 75,
    public near: number = 0.1,
    public far: number = 1000,
    public active: boolean = true
  ) {}
}
