// @ts-check
import { EntityHurtAfterEvent, Player, world } from "@minecraft/server";

export default class HoneySlimeEntity {
    constructor() {
        world.afterEvents.entityHurt.subscribe(this.attackEffects.bind(this));
    }
    /**
     * @param arg
     */
    attackEffects(arg: { hurtEntity: any; damageSource: any }) {
        const { hurtEntity: player, damageSource } = arg;

        if (
            !(player instanceof Player) ||
            damageSource.damagingEntity?.typeId != "cib:honey_slime"
        ) {
            return;
        }

        player.addEffect("slowness", 20 * 3, {
            amplifier: 4,
            showParticles: false,
        });
        const dimension = player.dimension;

        for (let i = 0; i < 3; i++) {
            dimension.spawnEntity("minecraft:bee", player.location);
        }
    }
}
