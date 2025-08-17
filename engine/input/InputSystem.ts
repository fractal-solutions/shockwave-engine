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
    // Reset mouse delta each frame
    this.mouseDeltaX = 0;
    this.mouseDeltaY = 0;
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
    return this.mouseDeltaX;
  }

  public getMouseDeltaY(): number {
    return this.mouseDeltaY;
  }

  public requestPointerLock(): void {
    document.body.requestPointerLock();
  }

  public exitPointerLock(): void {
    document.exitPointerLock();
  }
}
