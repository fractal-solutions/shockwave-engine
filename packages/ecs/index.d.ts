export interface Component {
}
export type Entity = number;
export interface System {
    priority: number;
    init(world: World): void;
    update(world: World, dt: number): void;
}
export interface QuerySpec {
    all?: Function[];
    any?: Function[];
    none?: Function[];
}
export type WorldEvent = string;
export interface World {
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
