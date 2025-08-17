import { Vector3, Quaternion } from 'three';
// Component types
export class TransformComponent {
    position;
    rotation;
    scale;
    constructor(position = new Vector3(), rotation = new Quaternion(), scale = new Vector3(1, 1, 1)) {
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
    }
}
export class RenderableComponent {
    modelPath;
    materialPath;
    constructor(modelPath, materialPath) {
        this.modelPath = modelPath;
        this.materialPath = materialPath;
    }
}
export var PhysicsBodyType;
(function (PhysicsBodyType) {
    PhysicsBodyType["STATIC"] = "static";
    PhysicsBodyType["DYNAMIC"] = "dynamic";
    PhysicsBodyType["KINEMATIC"] = "kinematic";
})(PhysicsBodyType || (PhysicsBodyType = {}));
export var PhysicsShapeType;
(function (PhysicsShapeType) {
    PhysicsShapeType["BOX"] = "box";
    PhysicsShapeType["SPHERE"] = "sphere";
    PhysicsShapeType["CAPSULE"] = "capsule";
    PhysicsShapeType["MESH"] = "mesh";
})(PhysicsShapeType || (PhysicsShapeType = {}));
export class PhysicsBodyComponent {
    bodyType;
    mass;
    shape;
    halfExtents;
    radius;
    height;
    meshPath;
    constructor(bodyType = PhysicsBodyType.DYNAMIC, mass = 1, shape = PhysicsShapeType.BOX, halfExtents, // For BOX
    radius, // For SPHERE, CAPSULE
    height, // For CAPSULE
    meshPath // For MESH
    ) {
        this.bodyType = bodyType;
        this.mass = mass;
        this.shape = shape;
        this.halfExtents = halfExtents;
        this.radius = radius;
        this.height = height;
        this.meshPath = meshPath;
    }
}
export class PlayerControllerComponent {
    moveSpeed;
    jumpForce;
    airControl;
    crouchHeight;
    standHeight;
    slopeLimit;
    constructor(moveSpeed = 5, jumpForce = 8, airControl = 0.1, crouchHeight = 0.5, standHeight = 1.8, slopeLimit = Math.PI / 4 // 45 degrees
    ) {
        this.moveSpeed = moveSpeed;
        this.jumpForce = jumpForce;
        this.airControl = airControl;
        this.crouchHeight = crouchHeight;
        this.standHeight = standHeight;
        this.slopeLimit = slopeLimit;
    }
}
export class CameraComponent {
    fov;
    near;
    far;
    active;
    constructor(fov = 75, near = 0.1, far = 1000, active = true) {
        this.fov = fov;
        this.near = near;
        this.far = far;
        this.active = active;
    }
}
