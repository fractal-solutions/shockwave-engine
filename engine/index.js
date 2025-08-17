import { RenderSystem } from './render/RenderSystem';
import { PhysicsSystem } from './physics/PhysicsSystem';
export class Engine {
    world;
    systems = [];
    lastTime = 0;
    constructor(world) {
        this.world = world;
        this.initSystems();
    }
    initSystems() {
        // Order matters here for system execution
        this.systems.push(new PhysicsSystem());
        this.systems.push(new RenderSystem());
        // Initialize all systems
        this.systems.sort((a, b) => a.priority - b.priority);
        for (const system of this.systems) {
            system.init(this.world);
        }
    }
    start() {
        this.lastTime = performance.now();
        this.loop();
    }
    loop = () => {
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = currentTime;
        this.update(deltaTime);
        requestAnimationFrame(this.loop);
    };
    update(dt) {
        for (const system of this.systems) {
            system.update(this.world, dt);
        }
    }
    getWorld() {
        return this.world;
    }
}
