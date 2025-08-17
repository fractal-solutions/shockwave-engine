import { System, World } from '@shockwave/ecs';
import * as THREE from 'three';
import { TransformComponent, RenderableComponent, PlayerControllerComponent } from '../components';

export class RenderSystem implements System {
  priority: number = 20;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private entityMeshMap = new Map<number, THREE.Mesh>();

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 2, 0.1, 1000); // Aspect ratio will be set later

    // Basic scene setup
    this.camera.position.z = 5;
    const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
    this.scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1).normalize();
    this.scene.add(directionalLight);

    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  public setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.onWindowResize(); // Set initial size
  }

  init(world: World): void {
    console.log("RenderSystem initialized.");
  }

  update(world: World, dt: number): void {
    if (!this.renderer || !this.scene || !this.camera) {
      return;
    }

    // Update camera based on player position
    const players = world.query({
      all: [PlayerControllerComponent, TransformComponent],
    });

    if (players.length > 0) {
      const playerTransform = world.getComponent(players[0], TransformComponent) as TransformComponent;
      // Offset camera slightly above player's center
      this.camera.position.copy(playerTransform.position).add(new THREE.Vector3(0, 0.5, 0));
      this.camera.quaternion.copy(playerTransform.rotation);
    }

    const renderableEntities = world.query({
      all: [TransformComponent, RenderableComponent],
    });

    const entitiesToKeep = new Set<number>();

    for (const entityId of renderableEntities) {
      entitiesToKeep.add(entityId);
      let mesh = this.entityMeshMap.get(entityId);
      const transform = world.getComponent(entityId, TransformComponent);
      const renderable = world.getComponent(entityId, RenderableComponent);

      if (transform && renderable) {
        if (!mesh) {
          // Create new mesh if it doesn't exist
          const geometry = new THREE.BoxGeometry(1, 1, 1); // Placeholder geometry
          const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
          mesh = new THREE.Mesh(geometry, material);
          this.scene.add(mesh);
          this.entityMeshMap.set(entityId, mesh);
        }

        // Update mesh transform
        mesh.position.copy(transform.position);
        mesh.quaternion.copy(transform.rotation);
        mesh.scale.copy(transform.scale);
      }
    }

    // Remove meshes for entities that are no longer renderable
    for (const [entityId, mesh] of this.entityMeshMap.entries()) {
      if (!entitiesToKeep.has(entityId)) {
        this.scene.remove(mesh);
        this.entityMeshMap.delete(entityId);
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize(): void {
    if (this.canvas && this.renderer) {
      const width = this.canvas.clientWidth;
      const height = this.canvas.clientHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }
  }

  public getScene(): THREE.Scene {
    return this.scene;
  }

  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  public getRenderer(): THREE.WebGLRenderer {
    return this.renderer!;
  }
}
