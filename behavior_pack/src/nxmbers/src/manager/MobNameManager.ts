import { EntitySpawnAfterEvent, world } from "@minecraft/server";
import Imaginary from "../Imaginary";
import WithLogger from "../util/WithLogger";

export interface MobNameRegistry {
    mobId?: string;
    MOB_ID: string;
    displayName: string;
}

export default class MobNameManager extends WithLogger {
    private registry: Map<string, MobNameRegistry>;

    public constructor() {
        super();
        world.afterEvents.entitySpawn.subscribe(this.onMobSpawned.bind(this));
        this.registry = new Map();
        Imaginary.LOGGER.info("Mob name manager loaded");
    }

    public addRegistry(registry: MobNameRegistry) {
        this.registry.set(registry.mobId ?? registry.MOB_ID, registry);
        Imaginary.LOGGER.robust(
            "Mob name registry added: " +
                (registry.mobId ?? registry.MOB_ID) +
                ` '${registry.displayName}'`,
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

        Imaginary.LOGGER.robust(
            "Mob name registry triggered: " +
                (registry.mobId ?? registry.MOB_ID) +
                ` '${registry.displayName}'`,
        );
    }
}
