import {
    BlockTypes,
    EntityDamageCause,
    Player,
    ProjectileHitEntityAfterEvent,
    system,
    world,
} from "@minecraft/server";
import Imaginary from "../Imaginary";

export default class BreezeEntity {
    public constructor() {
        world.afterEvents.projectileHitEntity.subscribe(this.onWindChargeHit);
    }

    public onWindChargeHit(event: ProjectileHitEntityAfterEvent) {
        try {
            const { projectile, source } = event;
            const player = event.getEntityHit().entity;

            if (
                !(player instanceof Player) ||
                !player ||
                projectile?.typeId !=
                    "minecraft:breeze_wind_charge_projectile" ||
                source?.typeId != "minecraft:breeze"
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

            const block = player.dimension.getBlock(player.location);

            if (block.typeId == "minecraft:air") {
                block.setType(BlockTypes.get("minecraft:web"));
            }

            player.addEffect("blindness", 20 * 3);
            player.addEffect("poison", 20 * 3);
            player.applyDamage(8, {
                damagingEntity: source,
                cause: EntityDamageCause.entityAttack,
            });
        } catch (error) {
            Imaginary.logger().error(error, error.stack);
        }
    }
}
