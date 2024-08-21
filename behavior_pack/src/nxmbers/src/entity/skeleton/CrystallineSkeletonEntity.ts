import { Block, Entity, system, Vector3, world } from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";
import { MobNameRegistry } from "nxmbers/src/manager/MobNameManager";
import { Vector3Builder } from "nxmbers/src/util/vector/VectorWrapper";

export default class CrystallineSkeletonEntity implements MobNameRegistry {
    public readonly MOB_ID = "cib:crystalline_skeleton";
    public readonly CLOUD_ID = "cib:crystalline_cloud";

    public constructor() {
        world.afterEvents.projectileHitBlock.subscribe(
            this.onProjectileHitBlock.bind(this),
        );
        world.afterEvents.projectileHitEntity.subscribe(
            this.onProjectileHitEntity.bind(this),
        );
        Imaginary.getMobNameManager().addRegistry(this);
        Imaginary.LOGGER.robust("Crystalline skeleton entity loaded");
    }

    public mobId: string = this.MOB_ID;
    public readonly displayName: string = "§6Esqueleto Cristalino";

    private onProjectileHitBlock(arg: any) {
        if (arg.source?.typeId !== this.MOB_ID) {
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
        if (arg.source?.typeId !== this.MOB_ID) {
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

    private arrowImpacted(
        arrow: Entity,
        location: Vector3,
        source: Entity,
        hitBlock: Block = undefined,
        hitEntity: Entity = undefined,
    ) {
        try {
            source.dimension.createExplosion(location, 3, {
                source: source,
                breaksBlocks: false,
                causesFire: false,
            });
            source.dimension.spawnEntity(this.CLOUD_ID, location);

            if (hitEntity) {
                const shouldAttract = Math.random() < 0.4;

                if (shouldAttract) {
                    const knockbackDirection = new Vector3Builder(
                        source.location,
                    )
                        .subtract(hitEntity.location)
                        .add(new Vector3Builder(0, 0.5, 0));

                    const magnitude = knockbackDirection.magnitude();
                    const normalizedDirection = knockbackDirection.normalize();

                    hitEntity.applyKnockback(
                        normalizedDirection.x,
                        normalizedDirection.z,
                        magnitude,
                        0,
                    );
                }
            }
        } catch (error) {
            Imaginary.LOGGER.error(error);
        }
    }
}
