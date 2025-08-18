# Shockwave Engine

Shockwave is a 3D game engine and editor built with Three.js, TypeScript, and React, designed for "Quake-style" FPS games.

## Quick Start

To get started with Shockwave, follow these steps:

1.  **Install Bun:** If you don't have Bun installed, follow the instructions on the [Bun website](https://bun.sh/docs/installation).

2.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd shockwave
    ```

3.  **Install dependencies:**
    ```bash
    bun install
    ```


4.  **Build all packages:**
    ```bash
    bun run build
    ```

5.  **Run the Editor:**
    ```bash
    bun run dev:editor
    ```
    This will start the development server for the editor, usually accessible at `http://localhost:3000`.

6.  **Run the Runtime App:**
    ```bash
    bun run start:runtime
    ```
    This will execute the standalone runtime application (currently logs to console).

## Architecture Overview

Shockwave is designed with modularity, performance, and extensibility in mind, separating the core engine (runtime) from the editor tools.

### Top-Level Folders:

*   `/engine/`: Contains the core runtime logic, independent of editor dependencies.
    *   `/core/ecs/`: Entity-Component-System implementation.
    *   `/render/`: Three.js rendering integration.
    *   `/physics/`: Physics adapter interface and `cannon-es` implementation.
    *   `/terrain/`: Terrain generation and rendering.
    *   `/particles/`: Particle system implementation.
    *   `/audio/`: Audio management.
    *   `/io/serialization/`: Scene and asset serialization.
    *   `/scripting/bridge/`: JavaScript scripting sandbox.
*   `/editor/`: The React-based application for the editor tools.
    *   `/panels/`: Individual UI panels (Hierarchy, Inspector, Viewport, etc.).
    *   `/viewport/`: Three.js scene management within the editor.
    *   `/state/`: Redux Toolkit store for editor state management.
    *   `/commands/`: Undo/redo command stack.
*   `/runtime-app/`: A minimal shell to load and run a game level in standalone play mode.
*   `/shared/`: Common definitions, interfaces, and schemas used by both the engine and editor.
    *   `/components/`: ECS component schemas.
    *   `/systems/`: ECS system interfaces.
    *   `/schemas/`: JSON schemas for scene and project data.
*   `/packages/`: Reusable utility libraries.
    *   `ecs/`: Core ECS interfaces and types.
    *   `math/`: Math utilities (vectors, quaternions, matrices).
    *   `utils/`: General utility functions.
    *   `csg/`: Constructive Solid Geometry operations.
    *   `gpgpu/`: GPGPU utilities for particle effects.
*   `/assets/`: Sample assets.
*   `/scripts/`: Build and utility scripts.
*   `/tests/`: Unit and end-to-end tests.

## Key Technologies:

*   **Language:** TypeScript
*   **Build Tool:** Bun + Vite (for editor)
*   **Renderer:** Three.js (WebGL2)
*   **Physics:** `cannon-es` (via an adapter for potential swapping)
*   **UI:** React + Tailwind CSS + Redux Toolkit
*   **Scripting:** Sandboxed JavaScript modules (via `iframe`/MessageChannel)
*   **Data:** JSON for scenes, binary blobs for assets
*   **Architecture:** ECS (Entity-Component-System)

## Next Steps / Future Work:

*   Implement concrete physics adapter (e.g., `CannonPhysicsAdapter`).
*   Integrate Three.js rendering into the `ViewportPanel` and `RenderSystem`.
*   Develop terrain generation and sculpting tools.
*   Build the model maker with CSG operations.
*   Implement particle system and editor.
*   Develop the scripting sandbox and Game API.
*   Add save/load functionality for projects and scenes.
*   Implement the FPS player controller.
*   Write comprehensive unit and E2E tests.

This `README.md` provides a high-level overview. More detailed documentation for the Scripting API and JSON schemas will be available in the `docs/` directory as development progresses.