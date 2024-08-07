import { BlockTypes, EntityDamageCause, Player, system, world } from "@minecraft/server";

world.afterEvents.projectileHitEntity.subscribe((arg) => {
    try {
        const { projectile, source } = arg
        const player = arg.getEntityHit().entity

        if (!(player instanceof Player) || !player || projectile?.typeId != "minecraft:breeze_wind_charge_projectile" || source?.typeId != "cib:breeze_skeleton") {
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

        player.applyDamage(6, { "damagingEntity": source, "cause": EntityDamageCause.entityAttack })

    } catch (error) {
        console.error("Error at nxmbers/entity/Breeze.js: ", error, error.stack)
    }
})
