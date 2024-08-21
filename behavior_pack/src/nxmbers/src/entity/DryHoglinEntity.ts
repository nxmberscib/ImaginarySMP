import {
    EntityHurtAfterEvent,
    Player,
    ProjectileHitEntityAfterEvent,
    world,
} from "@minecraft/server";
import Imaginary from "../Imaginary";
import { MobNameRegistry } from "../manager/MobNameManager";
import { Vector3Builder } from "../util/vector/VectorWrapper";
import TimerUtils from "teseract/api/util/TimerUtils";
import { VECTOR3_UP } from "../util/vector/CoreHelpers";

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

export default class DryHoglinEntity implements MobNameRegistry {
    public MOB_ID: string = "cib:dry_hoglin";
    public displayName: string = "§fHoglin Seco";
    private readonly ATTACK_INFO = new Map<string, number>();

    public constructor() {
        Imaginary.getMobNameManager().addRegistry(this);
        world.afterEvents.entityHurt.subscribe(this.onAttack.bind(this));
        world.afterEvents.entityHurt.subscribe(this.onAttacked.bind(this));
        world.afterEvents.projectileHitEntity.subscribe(
            this.onArrowHit.bind(this),
        );
        Imaginary.LOGGER.robust("Dry hoglin entity loaded");
    }

    private onAttack({
        hurtEntity: entity,
        damage,
        damageSource: { damagingEntity: damager },
    }: EntityHurtAfterEvent) {
        try {
            if (damager?.typeId != this.MOB_ID) {
                return;
            }
            const direction = new Vector3Builder(
                damager.getViewDirection(),
            ).normalize();

            entity.applyKnockback(direction.x, direction.z, 1.5, direction.y);
        } catch (error) {
            Imaginary.LOGGER.error(error);
        }
    }

    private async onArrowHit(event: ProjectileHitEntityAfterEvent) {
        if (!event.projectile.isValid()) {
            return;
        }
        if (event.projectile.getTags().includes("GivesDryHoglinPoison")) {
            return event
                .getEntityHit()
                .entity.addEffect("poison", TimerUtils.fromSecondsToTicks(5), {
                    amplifier: 2,
                });
        }
        if (event.projectile.getTags().includes("GivesDryHoglinDamage")) {
            return event
                .getEntityHit()
                .entity.addEffect("instant_damage", 1, { amplifier: 2 });
        }
    }

    private async onAttacked({
        hurtEntity: hoglin,
        damage,
        damageSource: { damagingEntity: damager },
    }: EntityHurtAfterEvent) {
        try {
            if (hoglin?.typeId != this.MOB_ID || !(damager instanceof Player)) {
                return;
            }

            if (
                Math.random() > 0.35 ||
                this.ATTACK_INFO.get(hoglin.id) > Date.now()
            ) {
                return;
            }

            hoglin.addEffect("slowness", TimerUtils.fromSecondsToTicks(5.5), {
                amplifier: 254,
                showParticles: false,
            });
            hoglin.dimension.playSound(
                "mob.dry_hoglin.special_attack",
                hoglin.location,
            );

            this.ATTACK_INFO.set(
                hoglin.id,
                Date.now() + TimerUtils.fromSecondsToMilliseconds(15),
            );

            await TimerUtils.sleep(TimerUtils.fromSecondsToTicks(2.5));

            if (!hoglin.isValid()) {
                this.ATTACK_INFO.delete(hoglin.id);
                return;
            }

            for (let x = 0; x <= 40; x++) {
                const arrow = hoglin.dimension.spawnEntity(
                    "minecraft:arrow<from_dry_hoglin>",
                    new Vector3Builder(
                        hoglin.location.x,
                        hoglin.location.y + 2,
                        hoglin.location.z,
                    ),
                );

                (Math.random() > 0.5
                    ? () => {
                          arrow.addTag("GivesDryHoglinPoison");
                          arrow.addEffect("poison", TimerUtils.MaxTickRange);
                      }
                    : () => {
                          arrow.addTag("GivesDryHoglinDamage");
                          arrow.addEffect(
                              "instant_damage",
                              TimerUtils.MaxTickRange,
                          );
                      })();

                const projectile = arrow.getComponent("projectile");

                projectile.owner = hoglin;
                const direction = new Vector3Builder(VECTOR3_UP);
                direction.y = 0;
                projectile.shoot(
                    direction.add(
                        new Vector3Builder(
                            getRandomArbitrary(-0.65, 0.65),
                            getRandomArbitrary(0, 1),
                            getRandomArbitrary(-0.65, 0.65),
                        ),
                    ),
                );
            }
        } catch (error) {
            Imaginary.LOGGER.error(error);
        }
    }
}
