import { Component, Entity, QuerySpec, World as IWorld, WorldEvent } from '@shockwave/ecs';
export declare class World implements IWorld {
    private nextEntityId;
    private entities;
    private eventListeners;
    createEntity(): Entity;
    addComponent<T extends Component>(entity: Entity, component: T): void;
    getComponent<T extends Component>(entity: Entity, type: new (...args: any[]) => T): T | null;
    removeComponent<T extends Component>(entity: Entity, type: new (...args: any[]) => T): void;
    query(spec: QuerySpec): Entity[];
    on(event: WorldEvent, handler: (data: any) => void): void;
    emit(event: WorldEvent, data?: any): void;
    removeEntity(entity: Entity): void;
    getComponents(entity: Entity): Component[];
}
