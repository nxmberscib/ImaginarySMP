// @ts-check

import { EntityHurtAfterEvent, Player, world } from "@minecraft/server";

export default class PreassureAssasin {
    constructor() {
        world.afterEvents.entityHurt.subscribe(this.onAttack.bind(this))
    }
    /**
     * @param event
     */
    onAttack(event: EntityHurtAfterEvent) {
        const { damage, damageSource: { damagingEntity: damager }, hurtEntity: player } = event;
        if (damager?.typeId != "cib:preassure_assasin") {
            return;
        }

        if (!(player instanceof Player)) {
            return;
        }

        player.addEffect("blindness", 20 * 5);
    }
};
