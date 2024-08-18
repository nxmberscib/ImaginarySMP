import {
    EntityDieAfterEvent,
    EntityHurtAfterEvent,
    EntitySpawnAfterEvent,
    Player,
    world,
} from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";
import { MobNameRegistry } from "nxmbers/src/manager/MobNameManager";

export default class MarineSlimeEntity implements MobNameRegistry {
    public MOB_ID: string = "cib:marine_slime";
    public displayName: string = "§bSlime Marino";

    constructor() {
        world.afterEvents.entityDie.subscribe(this.spawnProtocol.bind(this));
        world.afterEvents.entityHurt.subscribe(this.attackEffects.bind(this));
        
        Imaginary.getMobNameManager().addRegistry(this);
        Imaginary.LOGGER.robust("Marine slime entity loaded");
    }

    public spawnProtocol(arg: EntityDieAfterEvent) {
        if (arg.deadEntity?.typeId != "minecraft:glow_squid") {
            return;
        }
        arg.deadEntity.dimension.spawnEntity(
            this.MOB_ID,
            arg.deadEntity.location,
        );
    }

    public attackEffects(arg: EntityHurtAfterEvent) {
        const { hurtEntity: player, damageSource } = arg;

        if (
            !(player instanceof Player) ||
            damageSource.damagingEntity?.typeId != this.MOB_ID
        ) {
            return;
        }

        player.addEffect("darkness", 20 * 5, { showParticles: false });
        const dimension = player.dimension;

        for (let i = 0; i < 3; i++) {
            dimension.spawnEntity("minecraft:dolphin", player.location);
            if (i == 2) continue;
            dimension.spawnEntity("minecraft:drowned", player.location);
        }
    }
}
