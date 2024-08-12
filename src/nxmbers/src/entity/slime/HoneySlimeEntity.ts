// @ts-check
import { EntityHurtAfterEvent, Player, world } from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";
import { MobNameRegistry } from "nxmbers/src/manager/MobNameManager";

export default class HoneySlimeEntity implements MobNameRegistry {
    public readonly MOB_ID = "cib:honey_slime";
    private logger() {
        return Imaginary.logger();
    }

    constructor() {
        world.afterEvents.entityHurt.subscribe(this.attackEffects.bind(this));
        Imaginary.getMobNameManager().addRegistry(this);
        this.logger().robust(this.MOB_ID + " registered");
    }

    public mobId: string = this.MOB_ID;
    public displayName: string = "§6Slime de Miel";

    public attackEffects(arg: EntityHurtAfterEvent) {
        try {
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
        } catch (error) {
            this.logger().error(error);
        }
    }
}
