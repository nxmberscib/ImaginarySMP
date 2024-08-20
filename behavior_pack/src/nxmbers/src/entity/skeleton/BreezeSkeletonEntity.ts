import {
    BlockTypes,
    EntityDamageCause,
    Player,
    system,
    world,
} from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";
import ImaginaryItems from "nxmbers/src/item/ImaginaryItems";
import { MobNameRegistry } from "nxmbers/src/manager/MobNameManager";

export default class BreezeSkeletonEntity implements MobNameRegistry {
    public PROJECTILE_ID = "minecraft:breeze_wind_charge_projectile";
    public MOB_ID = "cib:breeze_skeleton";
    public displayName: string = "§dEsqueleto Breeze";

    public constructor() {
        world.afterEvents.projectileHitEntity.subscribe(
            this.onProjectileHitEntity.bind(this),
        );
        Imaginary.getMobNameManager().addRegistry(this);
        Imaginary.LOGGER.robust("Breeze skeleton loaded");
    }

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
            //             if (block?.typeId != "minecraft:air") {
            //                 continue;
            //             }
            //             block.setType(BlockTypes.get("minecraft:web"))
            //         }
            //     }
            // }
            const obtainedFulminator = Imaginary.getItemManager()
                .getRegistries()
                .hasObtainedItem(
                    player,
                    ImaginaryItems.AUREUM_FULMINATOR.ITEM_ID,
                );
            player.applyDamage(6 + (obtainedFulminator ? 0 : 6), {
                damagingEntity: source,
                cause: EntityDamageCause.entityAttack,
            });
        } catch (error) {
            Imaginary.LOGGER.error(error);
        }
    }
}
