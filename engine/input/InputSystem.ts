import { System, World } from '@shockwave/ecs';

export class InputSystem implements System {
  priority: number = 0; // High priority to capture input early
  private keys: Map<string, boolean> = new Map();
  private mouseDeltaX: number = 0;
  private mouseDeltaY: number = 0;
  private isPointerLocked: boolean = false;

  constructor() {
    document.addEventListener('keydown', this.onKeyDown.bind(this));
    document.addEventListener('keyup', this.onKeyUp.bind(this));
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('pointerlockchange', this.onPointerLockChange.bind(this));
    document.addEventListener('mouselockchange', this.onPointerLockChange.bind(this)); // For older browsers
  }

  init(world: World): void {
    console.log("InputSystem initialized.");
  }

  update(world: World, dt: number): void {
    // This method is now intentionally empty.
    // Deltas are reset on read to prevent timing issues.
  }

  private onKeyDown(event: KeyboardEvent): void {
    this.keys.set(event.code, true);
  }

  private onKeyUp(event: KeyboardEvent): void {
    this.keys.set(event.code, false);
  }

  private onMouseMove(event: MouseEvent): void {
    if (this.isPointerLocked) {
      this.mouseDeltaX += event.movementX;
      this.mouseDeltaY += event.movementY;
    }
  }

  private onPointerLockChange(): void {
    this.isPointerLocked = document.pointerLockElement === document.body;
  }

  public isKeyDown(code: string): boolean {
    return this.keys.get(code) || false;
  }

  public getMouseDeltaX(): number {
    const delta = this.mouseDeltaX;
    this.mouseDeltaX = 0; // Reset after reading
    return delta;
  }

  public getMouseDeltaY(): number {
    const delta = this.mouseDeltaY;
    this.mouseDeltaY = 0; // Reset after reading
    return delta;
  }

  public requestPointerLock(): void {
    document.body.requestPointerLock();
  }

  public exitPointerLock(): void {
    document.exitPointerLock();
  }
}
