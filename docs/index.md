# Scripting API Documentation

This document will detail the exposed Game API for scripting behaviors within Shockwave.

## Core Objects:

*   `Game`: Global access to engine functionalities.
*   `World`: Interact with entities and components.
*   `Entity`: Manipulate individual entities.
*   `Component`: Access and modify component data.
*   `Events`: Custom event system.
*   `Input`: Read player input.
*   `Physics`: Perform raycasts, query physics world.
*   `Particles`: Control particle emitters.
*   `Audio`: Play sounds.
*   `Nav`: Navigation mesh queries (stub).
*   `UI`: Interact with in-game UI elements.

## Example Usage:

```typescript
// Example: Spawning an entity
const newEntity = Game.spawn("my_prefab", new Game.Vec3(0, 0, 0));

// Example: Listening for a collision event
Game.on("collision", (data) => {
  console.log("Collision detected:", data.entityA, data.entityB);
});

// Example: Setting a timer
Game.time.setTimeout(1000, () => {
  console.log("One second passed!");
});
```

---

# Scene and Project JSON Schemas

This section will provide detailed JSON schemas for the scene and project file formats.

## Scene Schema (`scene.schema.json`)

(Refer to `shared/schemas/scene.schema.json` for the current definition)

## Project Manifest Schema (`project.schema.json`)

(To be defined)
