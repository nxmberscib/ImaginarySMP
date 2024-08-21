import {
    Entity,
    EntityDamageCause,
    LocationInUnloadedChunkError,
    LocationOutOfWorldBoundariesError,
    Vector3,
} from "@minecraft/server";
import { Vector3Builder } from "../vector/VectorWrapper";
import Imaginary from "nxmbers/src/Imaginary";

export default function ShootSonicBoom(
    source: Entity,
    sourceLocation: Vector3,
    direction: Vector3,
    distance: number = 15,
    damage: number = 1,
    particle: string = "minecraft:sonic_explosion",
    sound: string = "mob.warden.sonic_boom",
) {
    try {
        const sourceVector = new Vector3Builder(sourceLocation);
        source.dimension.playSound(sound, source.location);

        for (let i = 0; i <= distance; i++) {
            const point = new Vector3Builder(sourceVector).add(
                new Vector3Builder(direction).normalize().scale(i + 0.2),
            );

            source.dimension.spawnParticle(particle, point);
            for (const entity of source.dimension.getEntities({
                location: point,
                maxDistance: 2,
            })) {
                if (entity.id == source.id) {
                    continue;
                }
                entity.applyDamage(damage, {
                    damagingEntity: source,
                    cause: EntityDamageCause.sonicBoom,
                });
            }
        }
    } catch (error) {
        if (
            !(
                error instanceof LocationOutOfWorldBoundariesError &&
                error instanceof LocationInUnloadedChunkError
            )
        ) {
            Imaginary.LOGGER.error(error);
        }
    }
}
