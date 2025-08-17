import { System, World } from '@shockwave/ecs';
import * as THREE from 'three';
export declare class RenderSystem implements System {
    priority: number;
    private scene;
    private camera;
    private renderer;
    constructor();
    init(world: World): void;
    update(world: World, dt: number): void;
    private onWindowResize;
    getScene(): THREE.Scene;
    getCamera(): THREE.PerspectiveCamera;
    getRenderer(): THREE.WebGLRenderer;
}
