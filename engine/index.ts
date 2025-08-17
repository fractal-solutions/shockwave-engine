import { System } from '@shockwave/ecs';
import { World } from './core/World'; // Corrected import path
import { RenderSystem } from './render/RenderSystem';
import { PhysicsSystem } from './physics/PhysicsSystem';
import { InputSystem } from './input/InputSystem';
import { PlayerMovementSystem } from './player/PlayerMovementSystem';

export { World } from './core/World';

export class Engine {
  private world: World;
  private systems: System[] = [];
  private lastTime: number = 0;
  public physicsSystem!: PhysicsSystem; // Publicly accessible PhysicsSystem
  public inputSystem!: InputSystem; // Publicly accessible InputSystem

  constructor(world: World, canvas?: HTMLCanvasElement) {
    this.world = world;
    this.initSystems(canvas);
  }

  private initSystems(canvas?: HTMLCanvasElement) {
    // Order matters here for system execution
    this.physicsSystem = new PhysicsSystem(); // Assign to public property
    this.inputSystem = new InputSystem(); // Assign to public property
    const renderSystem = new RenderSystem(); // Instantiate RenderSystem here
    if (canvas) {
      renderSystem.setCanvas(canvas);
    }
    const playerMovementSystem = new PlayerMovementSystem(this.inputSystem, this.physicsSystem, renderSystem);

    this.systems.push(this.inputSystem);
    this.systems.push(this.physicsSystem);
    this.systems.push(playerMovementSystem);
    this.systems.push(renderSystem);

    // Initialize all systems
    this.systems.sort((a, b) => a.priority - b.priority);
    for (const system of this.systems) {
      system.init(this.world);
    }
  }

  public start() {
    this.lastTime = performance.now();
    this.loop();
  }

  private loop = () => {
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
    this.lastTime = currentTime;

    this.update(deltaTime);

    requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    for (const system of this.systems) {
      system.update(this.world, dt);
    }
  }

  public getWorld(): World {
    return this.world;
  }

  public getSystem<T extends System>(type: new (...args: any[]) => T): T | undefined {
    return this.systems.find(system => system instanceof type) as T;
  }
}
