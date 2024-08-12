import {
    BlockTypes,
    EntityDamageCause,
    Player,
    system,
    world,
} from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";
import { MobNameRegistry } from "nxmbers/src/manager/MobNameManager";

export default class BreezeSkeletonEntity implements MobNameRegistry {
    private PROJECTILE_ID = "minecraft:breeze_wind_charge_projectile";
    private MOB_ID = "cib:breeze_skeleton";

    private logger() {
        return Imaginary.logger();
    }

    public constructor() {
        world.afterEvents.projectileHitEntity.subscribe(
            this.onProjectileHitEntity.bind(this),
        );
    }

    public mobId: string;
    public displayName: string;

    private onProjectileHitEntity(arg: any) {
        try {
            const { projectile, source } = arg;
            const player = arg.getEntityHit().entity;

            if (
                !(player instanceof Player) ||
                !player ||
                projectile?.typeId != this.PROJECTILE_ID ||
                source?.typeId != this.MOB_ID
            ) {
                return;
            }

            // for (let dx = -1; dx <= 1; dx++) {
            //     for (let dz = -1; dz <= 1; dz++) {
            //         for (let dy = -1; dy <= 0; dy++) {
            //             const location = player.location;
            //             location.x += dx
            //             location.z += dz
            //             location.y += dy

            //             const block = player.dimension.getBlock(location)
            //             if (block.typeId != "minecraft:air") {
            //                 continue;
            //             }
            //             block.setType(BlockTypes.get("minecraft:web"))
            //         }
            //     }
            // }

            player.applyDamage(6, {
                damagingEntity: source,
                cause: EntityDamageCause.entityAttack,
            });
        } catch (error) {
            this.logger().error(error);
        }
    }
}
