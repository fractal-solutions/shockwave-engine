import { Component, Entity, System, QuerySpec, World as IWorld, WorldEvent } from '@shockwave/ecs';

export class World implements IWorld {
  private nextEntityId: Entity = 0;
  private entities = new Map<Entity, Map<string, Component>>();
  private eventListeners = new Map<WorldEvent, ((data: any) => void)[]>();

  createEntity(): Entity {
    const id = this.nextEntityId++;
    this.entities.set(id, new Map<string, Component>());
    return id;
  }

  addComponent<T extends Component>(entity: Entity, component: T): void {
    const components = this.entities.get(entity);
    if (components) {
      components.set(component.constructor.name, component);
    }
  }

  getComponent<T extends Component>(entity: Entity, type: new (...args: any[]) => T): T | null {
    const components = this.entities.get(entity);
    if (components) {
      return (components.get(type.name) as T) || null;
    }
    return null;
  }

  removeComponent<T extends Component>(entity: Entity, type: new (...args: any[]) => T): void {
    const components = this.entities.get(entity);
    if (components) {
      components.delete(type.name);
    }
  }

  query(spec: QuerySpec): Entity[] {
    const matchingEntities: Entity[] = [];
    for (const [entityId, components] of this.entities.entries()) {
      let matches = true;

      if (spec.all) {
        for (const type of spec.all) {
          if (!components.has(type.name)) {
            matches = false;
            break;
          }
        }
      }

      if (matches && spec.any) {
        let anyMatch = false;
        for (const type of spec.any) {
          if (components.has(type.name)) {
            anyMatch = true;
            break;
          }
        }
        if (!anyMatch) {
          matches = false;
        }
      }

      if (matches && spec.none) {
        for (const type of spec.none) {
          if (components.has(type.name)) {
            matches = false;
            break;
          }
        }
      }

      if (matches) {
        matchingEntities.push(entityId);
      }
    }
    return matchingEntities;
  }

  on(event: WorldEvent, handler: (data: any) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)?.push(handler);
  }

  emit(event: WorldEvent, data?: any): void {
    const handlers = this.eventListeners.get(event);
    if (handlers) {
      for (const handler of handlers) {
        handler(data);
      }
    }
  }

  removeEntity(entity: Entity): void {
    this.entities.delete(entity);
  }

  getComponents(entity: Entity): Component[] {
    const componentsMap = this.entities.get(entity);
    if (componentsMap) {
      return Array.from(componentsMap.values());
    }
    return [];
  }
}
