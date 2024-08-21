import {
    BlockPermutation,
    BlockTypes,
    EntityHurtAfterEvent,
    Player,
    world,
} from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";
import { MobNameRegistry } from "nxmbers/src/manager/MobNameManager";

export default class FrozenPiglinEntity implements MobNameRegistry {
    public readonly MOB_ID = "cib:frozen_piglin";

    private logger() {
        return Imaginary.logger();
    }

    public constructor() {
        world.afterEvents.entityHurt.subscribe(this.onAttack.bind(this));
        Imaginary.getMobNameManager().addRegistry(this);
        Imaginary.LOGGER.robust(this.MOB_ID + "registered");
    }

    public mobId: string = this.MOB_ID;
    public readonly displayName: string = "§bPiglin Congelado";

    private async onAttack(event: EntityHurtAfterEvent) {
        try {
            const {
                damage,
                damageSource: {
                    damagingEntity: damager,
                    damagingProjectile: projectile,
                },
                hurtEntity: player,
            } = event;

            if (!(player instanceof Player)) {
                return;
            }

            if (damager?.typeId != this.MOB_ID) {
                return;
            }

            // if (projectile) {
            //     const location = player.getHeadLocation()
            //     const block = player.dimension.getBlock(location);
            //     const old = block.permutation;
            //     block.setPermutation(
            //         BlockPermutation.resolve("minecraft:blue_ice"),
            //     );
            //     const blockLocation = block.center()
            //     const {x,y,z} = blockLocation
            //     await player.runCommandAsync(
            //         `fill ${x} ${y} ${z} ${x} ${y} ${z} air destroy`,
            //     );

            //     block.setPermutation(old);
            // }

            let slowness = player.getEffect("slowness");

            if (!slowness) {
                // @ts-ignore
                slowness = {
                    amplifier: -1,
                    duration: 20 * 10,
                    typeId: "slowness",
                };
            }

            player.addEffect(slowness?.typeId, slowness?.duration, {
                amplifier: slowness?.amplifier + 1,
            });
        } catch (error) {
            Imaginary.LOGGER.error(error);
        }
    }
}
