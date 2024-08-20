import {
    EntityHurtAfterEvent,
    Player,
    ProjectileHitEntityAfterEvent,
    world,
} from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";
import { MobNameRegistry } from "nxmbers/src/manager/MobNameManager";
import { calculateKnockbackVector } from "nxmbers/src/util/KnockbackFromPoint";
import TimerUtils from "teseract/api/util/TimerUtils";

export default class JirafitaEntity implements MobNameRegistry {
    public readonly MOB_ID: string = "cib:jirafita";
    public readonly displayName: string = "§hJirafita";

    public constructor() {
        world.afterEvents.projectileHitEntity.subscribe(
            this.onSpitHit.bind(this),
        );
        Imaginary.getMobNameManager().addRegistry(this);
        Imaginary.LOGGER.robust("Jirafita entity loaded");
    }

    public onSpitHit(event: ProjectileHitEntityAfterEvent) {
        const {
            source: jirafita,
            projectile: spit,
            location: hitLocation,
        } = event;
        const player = event.getEntityHit().entity;

        if (
            jirafita?.typeId != this.MOB_ID ||
            !spit ||
            !player ||
            !(player instanceof Player)
        ) {
            return;
        }

        const knockback = calculateKnockbackVector(
            player.location,
            hitLocation,
            5,
        );

        player.addEffect("slowness", TimerUtils.fromSecondsToTicks(10), {
            amplifier: 1,
        });
        player.addEffect("nausea", TimerUtils.fromSecondsToTicks(10));
        console.warn(knockback.x, knockback.y, knockback.z);
        player.applyKnockback(knockback.x, knockback.z, 5, 2);

        player.dimension.spawnParticle(
            "minecraft:breeze_wind_explosion_emitter",
            hitLocation,
        );

        player.dimension.playSound("wind_charge.burst", hitLocation);
    }
}
