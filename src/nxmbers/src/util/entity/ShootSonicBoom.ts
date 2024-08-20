import { Entity, EntityDamageCause, Vector3 } from "@minecraft/server";
import { Vector3Builder } from "../vector/VectorWrapper";

export default function ShootSonicBoom(
    source: Entity,
    sourceLocation: Vector3,
    direction: Vector3,
    distance: number,
    damage: number = 1,
) {
    const sourceVector = new Vector3Builder(sourceLocation);
    source.dimension.playSound("mob.warden.sonic_boom", source.location);

    for (let i = 0; i <= distance; i++) {
        const point = new Vector3Builder(sourceVector).add(
            new Vector3Builder(direction).normalize().scale(i + 0.2),
        );

        source.dimension.spawnParticle("minecraft:sonic_explosion", point);
        for (const entity of source.dimension.getEntities({
            location: point,
            maxDistance: 2,
        })) {
            entity.applyDamage(damage, {
                damagingEntity: source,
                cause: EntityDamageCause.sonicBoom,
            });
        }
    }
}
