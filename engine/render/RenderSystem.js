import * as THREE from 'three';
export class RenderSystem {
    priority = 20;
    scene;
    camera;
    renderer;
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        // Basic scene setup
        this.camera.position.z = 5;
        const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
        this.scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1).normalize();
        this.scene.add(directionalLight);
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }
    init(world) {
        console.log("RenderSystem initialized.");
        // Add initial entities to the scene if needed
    }
    update(world, dt) {
        // Update Three.js scene based on ECS entities with RenderableComponent and TransformComponent
        // For now, just render the scene
        this.renderer.render(this.scene, this.camera);
    }
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    getScene() {
        return this.scene;
    }
    getCamera() {
        return this.camera;
    }
    getRenderer() {
        return this.renderer;
    }
}
