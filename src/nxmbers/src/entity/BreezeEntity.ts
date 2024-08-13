import {
    BlockTypes,
    EntityDamageCause,
    Player,
    ProjectileHitEntityAfterEvent,
    system,
    world,
} from "@minecraft/server";
import Imaginary from "../Imaginary";
import WithLogger from "../util/WithLogger";

export default class BreezeEntity extends WithLogger {
    public MOB_ID: string = "minecraft:breeze";
    public CHARGE_ID: string = "minecraft:breeze_wind_charge_projectile";
    public constructor() {
        super();
        world.afterEvents.projectileHitEntity.subscribe(this.onWindChargeHit);
        this.logger().robust("Breeze entity loaded");
    }

    private onWindChargeHit(event: ProjectileHitEntityAfterEvent) {
        try {
            const { projectile, source } = event;
            const player = event.getEntityHit().entity;

            if (
                !player ||
                !(player instanceof Player) ||
                projectile?.typeId != this.CHARGE_ID ||
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
            this.logger().error(error);
        }
    }
}
