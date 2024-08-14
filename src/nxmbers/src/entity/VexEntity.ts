import {
    EntityHurtAfterEvent,
    HudElement,
    Player,
    world,
} from "@minecraft/server";
import WithLogger from "../util/WithLogger";
import { Vector3Builder } from "../util/vector/VectorWrapper";

export default class VexEntity extends WithLogger {
    public MOB_ID: string = "minecraft:vex";

    public constructor() {
        super();
        world.afterEvents.entityHurt.subscribe(this.onAttack.bind(this));
    }

    private onAttack(event: EntityHurtAfterEvent) {
        const {
            hurtEntity: player,
            damageSource: { damagingEntity: vex },
        } = event;

        if (!(player instanceof Player) || vex?.typeId != this.MOB_ID) {
            return;
        }

        const rocket = player.dimension.spawnEntity(
            "cib:vex_firework",
            player.location,
        );

        // rocket.getComponent("rideable")?.addRider(player);
        rocket.applyImpulse(new Vector3Builder(0, 5, 0));
        // rocket.getComponent("projectile")?.shoot(new Vector3Builder(0, 5, 0));
    }
}
