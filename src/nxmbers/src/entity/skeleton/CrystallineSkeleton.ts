import { Block, Entity, system, Vector3, world } from "@minecraft/server";

world.afterEvents.projectileHitBlock.subscribe((arg) => {
    if (arg.source?.typeId !== "cib:crystalline_skeleton") {
        return;
    }
    arrowImpacted(
        arg.projectile,
        arg.location,
        arg.source,
        arg.getBlockHit().block,
    );
});

world.afterEvents.projectileHitEntity.subscribe((arg) => {
    if (arg.source?.typeId !== "cib:crystalline_skeleton") {
        return;
    }
    arrowImpacted(
        arg.projectile,
        arg.location,
        arg.source,
        undefined,
        arg.getEntityHit().entity,
    );
});

/**
 *
 * @param {Entity} arrow
 * @param {Vector3} location
 * @param {Entity} source
 * @param {Entity} hitBlock
 * @param {Entity} hitEntity
 */
function arrowImpacted(
    arrow: Entity,
    location: Vector3,
    source: Entity,
    hitBlock: Block = undefined,
    hitEntity: Entity = undefined,
) {
    source.dimension.createExplosion(location, 3, {
        source: source,
        breaksBlocks: false,
        causesFire: false,
    });
    source.dimension.spawnEntity("cib:crystalline_cloud", location);
    if (hitEntity) {
        // Probabilidad del 40% de atraer
        const shouldAttract = Math.random() < 0.4;

        if (shouldAttract) {
            const knockbackDirection = {
                x: source.location.x - hitEntity.location.x,
                y: source.location.y - hitEntity.location.y + 0.5,
                z: source.location.z - hitEntity.location.z,
            };

            // Normalizar el vector de knockback
            const magnitude = Math.sqrt(
                knockbackDirection.x ** 2 +
                    knockbackDirection.y ** 2 +
                    knockbackDirection.z ** 2,
            );
            const normalizedDirection = {
                x: knockbackDirection.x / magnitude,
                y: knockbackDirection.y / magnitude,
                z: knockbackDirection.z / magnitude,
            };

            // Aplicar el knockback al hitEntity
            hitEntity.applyKnockback(
                normalizedDirection.x,
                normalizedDirection.z,
                magnitude,
                0,
            );
        }
    }
}
