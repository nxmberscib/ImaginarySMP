// @ts-check

import { EntityHurtAfterEvent, Player, world } from "@minecraft/server";

export default class FrozenPiglinEntity {
    /**
     * @readonly
     */
    MOB_ID = "cib:frozen_piglin";
    constructor() {
        world.afterEvents.entityHurt.subscribe(this.onAttack.bind(this));
    }
    /**
     *
     * @param event
     */
    onAttack(event: {
        damage: any;
        damageSource: { damagingEntity: any };
        hurtEntity: any;
    }) {
        const {
            damage,
            damageSource: { damagingEntity: damager },
            hurtEntity: player,
        } = event;
        if (!(player instanceof Player)) {
            return;
        }
        if (damager?.typeId != this.MOB_ID) {
            return;
        }
        let slowness = player.getEffect("slowness");
        if (!slowness) {
            // @ts-ignore
            slowness = {
                amplifier: -1,
                duration: 20 * 10,
                typeId: "slowness",
            };
        }
        // @ts-ignore
        player.addEffect(slowness?.typeId, slowness?.duration, {
            amplifier: slowness?.amplifier + 1,
        });
    }
}
