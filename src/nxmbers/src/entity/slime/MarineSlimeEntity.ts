import {
    EntityDieAfterEvent,
    EntityHurtAfterEvent,
    EntitySpawnAfterEvent,
    Player,
    world,
} from "@minecraft/server";

export default class MarineSlimeEntity {
    constructor() {
        world.afterEvents.entityDie.subscribe(this.spawnProtocol.bind(this));
        world.afterEvents.entityHurt.subscribe(this.attackEffects.bind(this));
    }

    /**
     * @param {EntityDieAfterEvent} arg
     */
    spawnProtocol(arg) {
        if (arg.deadEntity?.typeId != "minecraft:glow_squid") {
            return;
        }
        arg.deadEntity.dimension.spawnEntity(
            "cib:marine_slime",
            arg.deadEntity.location,
        );
    }

    /**
     * @param {EntityHurtAfterEvent} arg
     */
    attackEffects(arg) {
        const { hurtEntity: player, damageSource } = arg;

        if (
            !(player instanceof Player) ||
            damageSource.damagingEntity?.typeId != "cib:marine_slime"
        ) {
            return;
        }

        player.addEffect("darkness", 20 * 5, { showParticles: false });
        const dimension = player.dimension;

        for (let i = 0; i < 3; i++) {
            dimension.spawnEntity("minecraft:dolphin", player.location);
            if (i == 2) continue;
            dimension.spawnEntity("minecraft:drowned", player.location);
        }
    }
}
