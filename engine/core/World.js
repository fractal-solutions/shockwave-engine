export class World {
    nextEntityId = 0;
    entities = new Map();
    eventListeners = new Map();
    createEntity() {
        const id = this.nextEntityId++;
        this.entities.set(id, new Map());
        return id;
    }
    addComponent(entity, component) {
        const components = this.entities.get(entity);
        if (components) {
            components.set(component.constructor, component);
        }
    }
    getComponent(entity, type) {
        const components = this.entities.get(entity);
        if (components) {
            return components.get(type) || null;
        }
        return null;
    }
    removeComponent(entity, type) {
        const components = this.entities.get(entity);
        if (components) {
            components.delete(type);
        }
    }
    query(spec) {
        const matchingEntities = [];
        for (const [entityId, components] of this.entities.entries()) {
            let matches = true;
            if (spec.all) {
                for (const type of spec.all) {
                    if (!components.has(type)) {
                        matches = false;
                        break;
                    }
                }
            }
            if (matches && spec.any) {
                let anyMatch = false;
                for (const type of spec.any) {
                    if (components.has(type)) {
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
                    if (components.has(type)) {
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
    on(event, handler) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event)?.push(handler);
    }
    emit(event, data) {
        const handlers = this.eventListeners.get(event);
        if (handlers) {
            for (const handler of handlers) {
                handler(data);
            }
        }
    }
    removeEntity(entity) {
        this.entities.delete(entity);
    }
    getComponents(entity) {
        const componentsMap = this.entities.get(entity);
        if (componentsMap) {
            return Array.from(componentsMap.values());
        }
        return [];
    }
}
