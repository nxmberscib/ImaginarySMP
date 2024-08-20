import {
    BlockTypes,
    EntityDamageCause,
    Player,
    ProjectileHitEntityAfterEvent,
    system,
    world,
} from "@minecraft/server";
import Imaginary from "../Imaginary";

export default class DrownedEntity {
    public MOB_ID: string = "minecraft:drowned";
    public TRIDENT_ID: string = "minecraft:thrown_trident";

    public constructor() {
        world.afterEvents.projectileHitEntity.subscribe(
            this.onTridentHit.bind(this),
        );
        Imaginary.LOGGER.robust("Drowned entity loaded");
    }

    private onTridentHit(event: ProjectileHitEntityAfterEvent) {
        try {
            const { projectile, source } = event;
            const player = event.getEntityHit().entity;

            if (
                !(player instanceof Player) ||
                !player ||
                projectile?.typeId != this.TRIDENT_ID ||
                source?.typeId != this.MOB_ID
            ) {
                return;
            }

            source.teleport(player.location);
        } catch (error) {
            Imaginary.LOGGER.error(error);
        }
    }
}
