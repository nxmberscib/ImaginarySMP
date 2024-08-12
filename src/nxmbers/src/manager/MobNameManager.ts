import { EntitySpawnAfterEvent, world } from "@minecraft/server";
import Imaginary from "../Imaginary";

export interface MobNameRegistry {
    mobId: string;
    displayName: string;
}

export default class MobNameManager {
    private registry: Map<string, MobNameRegistry>;

    private logger() {
        return Imaginary.logger();
    }

    public constructor() {
        world.afterEvents.entitySpawn.subscribe(this.onMobSpawned.bind(this));
        this.registry = new Map();
        this.logger().info("Mob name manager initialized");
    }

    public addRegistry(registry: MobNameRegistry) {
        this.registry.set(registry.mobId, registry);
        this.logger().robust(
            "Mob name registry added: " +
                registry.mobId +
                `'${registry.displayName}'`,
        );
    }

    private onMobSpawned(event: EntitySpawnAfterEvent) {
        if (!event.entity.isValid()) {
            return;
        }
        const registry = this.registry.get(event.entity.typeId);
        
        if (!registry) {
            return;
        }

        event.entity.nameTag = registry.displayName;

        this.logger().robust(
            "Mob name registry triggered: " +
                registry.mobId +
                `'${registry.displayName}'`,
        );
    }
}
