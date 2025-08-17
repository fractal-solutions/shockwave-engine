import { World } from './core/World';
export declare class Engine {
    private world;
    private systems;
    private lastTime;
    constructor(world: World);
    private initSystems;
    start(): void;
    private loop;
    private update;
    getWorld(): World;
}
