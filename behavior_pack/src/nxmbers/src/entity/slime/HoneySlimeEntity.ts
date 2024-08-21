// @ts-check
import { EntityHurtAfterEvent, Player, world } from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";
import { MobNameRegistry } from "nxmbers/src/manager/MobNameManager";

export default class HoneySlimeEntity implements MobNameRegistry {
    public readonly MOB_ID = "cib:honey_slime";
    public readonly displayName: string = "§6Slime de Miel";

    public constructor() {
        world.afterEvents.entityHurt.subscribe(this.attackEffects.bind(this));
        Imaginary.getMobNameManager().addRegistry(this);
        Imaginary.LOGGER.robust(this.MOB_ID + " registered");
    }


    public attackEffects(arg: EntityHurtAfterEvent) {
        try {
            const { hurtEntity: player, damageSource } = arg;

            if (
                !(player instanceof Player) ||
                damageSource.damagingEntity?.typeId != this.MOB_ID
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
        } catch (error) {
            Imaginary.LOGGER.error(error);
        }
    }
}
