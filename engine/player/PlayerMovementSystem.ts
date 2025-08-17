import { System, World } from '@shockwave/ecs';
import { PhysicsSystem } from '../physics/PhysicsSystem';
import { InputSystem } from '../input/InputSystem';
import { RenderSystem } from '../render/RenderSystem';
import { PlayerControllerComponent, TransformComponent, PhysicsBodyComponent } from '../components';
import { Vector3, Quaternion, Euler } from 'three';

export class PlayerMovementSystem implements System {
  priority: number = 15;
  private inputSystem: InputSystem;
  private physicsSystem: PhysicsSystem;
  private renderSystem: RenderSystem;

  // Use Euler for simpler pitch/yaw management to avoid quaternion complexities
  private cameraEuler = new Euler(0, 0, 0, 'YXZ');
  private readonly PI_2 = Math.PI / 2;

  constructor(inputSystem: InputSystem, physicsSystem: PhysicsSystem, renderSystem: RenderSystem) {
    this.inputSystem = inputSystem;
    this.physicsSystem = physicsSystem;
    this.renderSystem = renderSystem;
  }

  init(world: World): void {
    // Add a click listener to request pointer lock
    document.body.addEventListener('click', () => {
      this.inputSystem.requestPointerLock();
    });
  }

  update(world: World, dt: number): void {
    const camera = this.renderSystem.getCamera();
    if (!camera) {
      return;
    }

    const players = world.query({
      all: [PlayerControllerComponent, TransformComponent, PhysicsBodyComponent],
    });

    for (const playerEntity of players) {
      const playerController = world.getComponent(playerEntity, PlayerControllerComponent);
      const transform = world.getComponent(playerEntity, TransformComponent);
      const body = this.physicsSystem.getBody(playerEntity);

      if (!playerController || !transform || !body) {
        continue;
      }

      // --- Mouse Look ---
      const mouseX = this.inputSystem.getMouseDeltaX();
      const mouseY = this.inputSystem.getMouseDeltaY();

      // Yaw (left/right) is applied to the whole body
      this.cameraEuler.y -= mouseX * 0.002;
      // Pitch (up/down) is applied only to the camera's rotation view
      this.cameraEuler.x -= mouseY * 0.002;

      // Clamp the pitch to prevent flipping upside down
      this.cameraEuler.x = Math.max(-this.PI_2, Math.min(this.PI_2, this.cameraEuler.x));

      // Apply the yaw rotation to the physics body
      const yawQuaternion = new Quaternion().setFromEuler(new Euler(0, this.cameraEuler.y, 0));
      body.quaternion.copy(yawQuaternion as any); // Using 'as any' to match cannon-es types if needed

      // Apply the full rotation (yaw + pitch) to the Three.js camera
      camera.quaternion.setFromEuler(this.cameraEuler);

      // --- Keyboard Movement ---
      const moveDirection = new Vector3();
      const forward = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      const right = new Vector3(1, 0, 0).applyQuaternion(camera.quaternion);

      if (this.inputSystem.isKeyDown('KeyW')) {
        moveDirection.add(forward);
      }
      if (this.inputSystem.isKeyDown('KeyS')) {
        moveDirection.sub(forward);
      }
      if (this.inputSystem.isKeyDown('KeyA')) {
        moveDirection.sub(right);
      }
      if (this.inputSystem.isKeyDown('KeyD')) {
        moveDirection.add(right);
      }

      // Keep movement horizontal
      moveDirection.y = 0;
      moveDirection.normalize().multiplyScalar(playerController.moveSpeed);

      // Preserve vertical velocity (for jumping/gravity)
      const currentVelocity = body.velocity;
      body.velocity.x = moveDirection.x;
      body.velocity.z = moveDirection.z;
      body.velocity.y = currentVelocity.y; // Keep existing y velocity

      // --- Jump ---
      if (this.inputSystem.isKeyDown('Space')) {
        // A proper ground check is needed here for a real game
        // For now, we allow jumping anytime
        body.velocity.y = playerController.jumpForce;
      }

      // --- Update camera position ---
      // The camera should follow the physics body's position
      transform.position.copy(body.position as any);
      camera.position.copy(transform.position).add(new Vector3(0, 0.5, 0)); // Offset camera slightly
    }
  }
}