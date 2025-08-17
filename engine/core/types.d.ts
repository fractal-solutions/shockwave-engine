import { Vector3, Quaternion } from 'three';
export type Vec3 = Vector3;
export type Quat = Quaternion;
export interface IComponent {
}
export declare class TransformComponent implements IComponent {
    position: Vec3;
    rotation: Quat;
    scale: Vec3;
    constructor(position?: Vec3, rotation?: Quat, scale?: Vec3);
}
export declare class RenderableComponent implements IComponent {
    modelPath: string;
    materialPath?: string | undefined;
    constructor(modelPath: string, materialPath?: string | undefined);
}
export declare enum PhysicsBodyType {
    STATIC = "static",
    DYNAMIC = "dynamic",
    KINEMATIC = "kinematic"
}
export declare enum PhysicsShapeType {
    BOX = "box",
    SPHERE = "sphere",
    CAPSULE = "capsule",
    MESH = "mesh"
}
export declare class PhysicsBodyComponent implements IComponent {
    bodyType: PhysicsBodyType;
    mass: number;
    shape: PhysicsShapeType;
    halfExtents?: Vec3 | undefined;
    radius?: number | undefined;
    height?: number | undefined;
    meshPath?: string | undefined;
    constructor(bodyType?: PhysicsBodyType, mass?: number, shape?: PhysicsShapeType, halfExtents?: Vec3 | undefined, // For BOX
    radius?: number | undefined, // For SPHERE, CAPSULE
    height?: number | undefined, // For CAPSULE
    meshPath?: string | undefined);
}
export declare class PlayerControllerComponent implements IComponent {
    moveSpeed: number;
    jumpForce: number;
    airControl: number;
    crouchHeight: number;
    standHeight: number;
    slopeLimit: number;
    constructor(moveSpeed?: number, jumpForce?: number, airControl?: number, crouchHeight?: number, standHeight?: number, slopeLimit?: number);
}
export declare class CameraComponent implements IComponent {
    fov: number;
    near: number;
    far: number;
    active: boolean;
    constructor(fov?: number, near?: number, far?: number, active?: boolean);
}
export interface SceneEntityData {
    id: string;
    name: string;
    tags: string[];
    components: {
        type: string;
        data: any;
    }[];
}
export interface SceneData {
    entities: SceneEntityData[];
}
