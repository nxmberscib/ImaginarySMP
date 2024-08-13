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

export default class DrownedEntity extends WithLogger {
    public MOB_ID: string = "minecraft:drowned";
    public TRIDENT_ID: string = "minecraft:thrown_trident";

    public constructor() {
        super();
        world.afterEvents.projectileHitEntity.subscribe(this.onTridentHit);
        this.logger().robust("Drowned entity loaded");
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

            if (Math.random() < 0.5) {
                return;
            }

            source.teleport(player.location);
        } catch (error) {
            this.logger().error(error);
        }
    }
}
