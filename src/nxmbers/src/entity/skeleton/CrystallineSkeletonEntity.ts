import { Block, Entity, system, Vector3, world } from "@minecraft/server";

export default class CrystallineSkeletonEntity {
    private CRYSTALLINE_SKELETON_ID = "cib:crystalline_skeleton";
    private CRYSTALLINE_CLOUD_ID = "cib:crystalline_cloud";

    public constructor() {
        world.afterEvents.projectileHitBlock.subscribe(
            this.onProjectileHitBlock.bind(this),
        );
        world.afterEvents.projectileHitEntity.subscribe(
            this.onProjectileHitEntity.bind(this),
        );
    }

    private onProjectileHitBlock(arg: any) {
        if (arg.source?.typeId !== this.CRYSTALLINE_SKELETON_ID) {
            return;
        }
        this.arrowImpacted(
            arg.projectile,
            arg.location,
            arg.source,
            arg.getBlockHit().block,
        );
    }

    private onProjectileHitEntity(arg: any) {
        if (arg.source?.typeId !== this.CRYSTALLINE_SKELETON_ID) {
            return;
        }
        this.arrowImpacted(
            arg.projectile,
            arg.location,
            arg.source,
            undefined,
            arg.getEntityHit().entity,
        );
    }

    /**
     * Maneja el impacto de una flecha, creando una explosión y posiblemente atrayendo entidades cercanas.
     *
     * @param {Entity} arrow
     * @param {Vector3} location
     * @param {Entity} source
     * @param {Block} [hitBlock]
     * @param {Entity} [hitEntity]
     */
    private arrowImpacted(
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
        source.dimension.spawnEntity(this.CRYSTALLINE_CLOUD_ID, location);

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
}
