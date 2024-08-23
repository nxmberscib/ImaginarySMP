// ? "Perfect" version

import {
    Vector3,
    Dimension,
    Player,
    HudElement,
    EntityRideableComponent,
    system,
    EquipmentSlot,
    ItemStartUseAfterEvent,
    ItemReleaseUseAfterEvent,
    ProjectileHitBlockAfterEvent,
    world,
    Entity,
    Block,
    LocationInUnloadedChunkError,
    LocationOutOfWorldBoundariesError,
} from "@minecraft/server";
import FormatUtils from "teseract/api/util/FormatUtils";
import TimerUtils from "teseract/api/util/TimerUtils";
import {
    Vector2Builder,
    Vector3Builder,
} from "../../util/vector/VectorWrapper";
import Imaginary from "../../Imaginary";
import GrappleData from "./GrappleData";
import Runnable from "teseract/api/util/Runnable";

function projectVector(a: Vector3Builder, b: Vector3Builder): Vector3Builder {
    const dotProduct = a.dot(b);
    const bLengthSquared = b.magnitude() ** 2;
    return b.scale(dotProduct / bLengthSquared);
}

function getPlayerSpeed(player: Player): {
    vx: number;
    vy: number;
    vz: number;
    speed: number;
    blocksPerSecond: number;
} {
    const { x: vx, y: vy, z: vz } = player.getVelocity();
    const speed = Math.hypot(vx, vy, vz);
    const blocksPerSecond = speed * 20;
    return { vx, vy, vz, speed, blocksPerSecond };
}
export default class GrapplingHandle extends Runnable {
    public static readonly ITEM_ID = "cib:grappling_hook";

    public static getGrappleData(player: Player): GrappleData {
        if (!player["GrappleData"]) {
            player["GrappleData"] = {
                hook: undefined,
                isGrappling: false,
                grappleStart: undefined,
            } as GrappleData;
        }
        return player["GrappleData"];
    }
    public getGrappleData(player: Player): GrappleData {
        return GrapplingHandle.getGrappleData(player);
    }

    public static getBelowBlock(
        entity: Entity,
        distance: number = 1,
    ): Block | undefined {
        try {
            const loc = entity.location;
            const ray = entity.dimension.getBlockFromRay(
                loc,
                { x: 0, y: -1, z: 0 },
                {
                    maxDistance: distance,
                },
            );
            if (!ray) return undefined;
            return ray.block;
        } catch (error: any) {
            if (error instanceof LocationOutOfWorldBoundariesError) {
                return undefined;
            }
            if (error instanceof LocationInUnloadedChunkError) {
                return undefined;
            }
            Imaginary.LOGGER.error(error);
        }
    }

    public getBelowBlock(
        entity: Entity,
        distance: number = 1,
    ): Block | undefined {
        return GrapplingHandle.getBelowBlock(entity, distance);
    }

    public static spawnGasParticle(dimension: Dimension, location: Vector3) {
        dimension.spawnParticle("cib:hook_gas", location);
    }

    public constructor() {
        super();
        this.runTimer(1);
        world.afterEvents.itemStartUse.subscribe(this.onStartUse.bind(this));
        world.afterEvents.itemReleaseUse.subscribe(
            this.onReleaseUse.bind(this),
        );
        world.afterEvents.projectileHitBlock.subscribe(
            this.onProjectileImpacted.bind(this),
        );
    }

    public override *onRunJob(...args: any[]): Generator<void, void, void> {
        for (const player of world.getAllPlayers()) {
            GrapplingHandle.reel(player);
        }
    }

    public static async endReeling(
        grappleData: GrappleData,
        player: Player,
        rideable: EntityRideableComponent,
        endedForSneaking = false,
    ) {
        try {
            grappleData.hookSeat.clearVelocity();
            rideable.ejectRiders();

            const velocity = new Vector3Builder(
                endedForSneaking
                    ? new Vector3Builder(player.getViewDirection())
                          .normalize()
                          .scale(1.5)
                    : grappleData.hookSeat.getVelocity(),
            );

            const projectedVelocity = (
                endedForSneaking
                    ? velocity
                    : projectVector(
                          velocity,
                          new Vector3Builder(player.getViewDirection()),
                      )
            ).clamp({
                min: new Vector3Builder(-2.5, -2.5, -2.5),
                max: new Vector3Builder(2.5, 2.5, 2.5),
            });

            player.runCommand("stopsound @s cib.maneuver_gear.gas_impulse");

            grappleData.hook.remove();
            grappleData.hookSeat.remove();

            player.dimension.playSound(
                "cib.maneuver_gear.hook_retract_wire",
                player.location,
            );

            const magnitude = projectedVelocity.clone().scale(1.5).magnitude();

            if (endedForSneaking) {
                grappleData.gasUsage += 1.5;
            }

            await TimerUtils.sleep(1);

            player.onScreenDisplay.setHudVisibility(1, [
                HudElement.HorseHealth,
            ]);

            player.dimension.playSound(
                "cib.maneuver_gear.hook_retract_gas",
                player.location,
            );

            player.applyKnockback(0, 0, 0, -player.getVelocity().y);

            player.applyKnockback(
                projectedVelocity.x,
                projectedVelocity.z,
                magnitude * 2 + 1,
                projectedVelocity.y * magnitude,
            );

            grappleData.isGrappling = false;
            grappleData.reachedObjective = false;

            grappleData.hook = undefined;
            grappleData.hookSeat = undefined;
            grappleData.initialViewVector = undefined;
        } catch (error) {
            Imaginary.LOGGER.error(error);
        }
    }

    public static reel(player: Player) {
        try {
            const grappleData = this.getGrappleData(player);
            const currentTick = system.currentTick;

            if (!grappleData.isGrappling) {
                return;
            }

            const hookSeat = grappleData.hookSeat;
            const rideable = hookSeat.getComponent("rideable");

            if (
                !hookSeat.isValid() ||
                hookSeat.hasTag("ended") ||
                rideable?.getRiders().length == 0 ||
                player
                    .getComponent("equippable")
                    .getEquipment(EquipmentSlot.Mainhand)?.typeId !=
                    this.ITEM_ID
            ) {
                if (!rideable) {
                    return;
                }

                this.endReeling(
                    grappleData,
                    player,
                    rideable,
                    rideable?.getRiders().length == 0 ? true : false,
                );

                return;
            }

            if (
                (currentTick - grappleData.grappleStart) % 42 === 0 &&
                !hookSeat.hasTag("ended") &&
                currentTick != grappleData.grappleStart &&
                !grappleData.reachedObjective
            ) {
                player.playSound("cib.maneuver_gear.gas_impulse");
            }

            const distance = new Vector3Builder(hookSeat.location).distance(
                grappleData.targetLocation,
            );
            hookSeat.clearVelocity();

            if (distance < 2) {
                if (distance > 1) {
                    const moveForce = new Vector3Builder(hookSeat.location)
                        .subtract(grappleData.hook.location)
                        .normalize()
                        .scale(-1);
                    Imaginary.LOGGER.debug(moveForce.toString(), distance);

                    hookSeat.applyImpulse(moveForce);
                    return;
                }

                grappleData.reachedObjective = true;

                TimerUtils.runLater(() => {
                    if (grappleData.playerGasObjectiveSound) {
                        return;
                    }

                    player.runCommand(
                        "stopsound @s cib.maneuver_gear.gas_impulse",
                    );

                    this.spawnGasParticle(
                        player.dimension,
                        new Vector3Builder(player.location),
                    );

                    player.dimension.playSound(
                        "cib.maneuver_gear.hook_retract_gas",
                        player.location,
                    );

                    grappleData.playerGasObjectiveSound = true;
                }, 5);

                return;
            }

            // hookSeat.addPotionEffects(
            //     new PotionEffect(PotionEffects.Resistance, 20, 255, false),
            //     new PotionEffect(PotionEffects.FireResistance, 20, 255, false),
            // );

            const gasLocation = new Vector3Builder(player.location)
                .add(new Vector3Builder(0, 1, 0))
                .subtract(
                    new Vector3Builder(player.getViewDirection()).scale(1.5),
                );

            TimerUtils.runLater(() => {
                this.spawnGasParticle(player.dimension, gasLocation);
            }, 1);

            const belowBlock = this.getBelowBlock(hookSeat);

            if (!belowBlock) {
                hookSeat.triggerEvent("air_control");
            } else {
                hookSeat.triggerEvent("ground_control");
            }

            const moveForce = new Vector3Builder(hookSeat.location)
                .subtract(grappleData.targetLocation)
                .normalize()
                .add(new Vector3Builder(0, -0.1, 0))
                .scale(-0.8);

            if (rideable.getRiders().length > 0)
                hookSeat.applyImpulse(moveForce);
        } catch (error) {
            Imaginary.LOGGER.error(error);
        }
    }

    public onStartUse(event: ItemStartUseAfterEvent) {
        try {
            const player = event.source;

            if (event.itemStack?.typeId != GrapplingHandle.ITEM_ID) {
                return;
            }

            // if (player.getSkillTree().getSkill(SkillTypes.Maneuverer).level == 0) {
            //     return;
            // }

            if (this.getGrappleData(player).isGrappling) {
                return;
            }

            if (player.isGliding && player.isSneaking) {
                this.getGrappleData(player).grappleStart = system.currentTick;
                player.addTag("IsGrippingWhileGlyding");
                return;
            }

            const dimension = player.dimension;
            const startLocation = player.getHeadLocation();
            const viewVector = new Vector3Builder(
                player.getViewDirection(),
            ).normalize();
            const maxDistance = 120;

            const targetBlock = dimension.getBlockFromRay(
                startLocation,
                viewVector,
                {
                    maxDistance: maxDistance,
                    includePassableBlocks: false,
                    includeLiquidBlocks: false,
                },
            )?.block;

            if (!targetBlock) {
                return;
            }

            const hook = player.dimension.spawnEntity(
                "cib:hook",
                player.getHeadLocation(),
            );

            hook.getComponent("leashable").leash(player);

            hook.getComponent("projectile").shoot(
                new Vector3Builder(targetBlock.center())
                    .subtract(hook.location)
                    .scale(2),
                { uncertainty: 0 },
            );

            player.dimension.playSound(
                "cib.maneuver_gear.hook_shooted",
                player.location,
            );

            hook.setDynamicProperty("grapple:owner", player.name);
            hook.setDynamicProperty("grapple:ownerID", player.id);

            const grappleData = this.getGrappleData(player);
            grappleData.hook = hook;
            // hook.setRotation(player.getRotation())
        } catch (error) {
            Imaginary.LOGGER.error(error);
        }
    }

    public onReleaseUse(event: ItemReleaseUseAfterEvent) {
        const player = event.source;

        if (event.itemStack?.typeId != GrapplingHandle.ITEM_ID) {
            return;
        }
        return;

        const grappleData = this.getGrappleData(player);
        player.removeTag("IsGrippingWhileGlyding");
        this.getGrappleData(player).grappleStart = undefined;
        if (grappleData.hook?.isValid()) {
            grappleData.hookSeat?.addTag("ended");
        }
        player.runCommand("stopsound @s cib.maneuver_gear.gas_impulse");
    }

    public onProjectileImpacted(event: ProjectileHitBlockAfterEvent) {
        const block = event.getBlockHit().block;
        const projectile = event.projectile;
        const dimension = event.dimension;

        if (projectile.typeId != "cib:hook") {
            return;
        }

        const player = world
            .getAllPlayers()
            .find((p) => this.getGrappleData(p)?.hook?.id == projectile.id);

        if (!player) {
            return;
        }

        const grappleData = this.getGrappleData(player);

        const hookSeat = dimension.spawnEntity(
            "cib:hook_seat",
            new Vector3Builder(player.location).add(
                new Vector3Builder(0, 0.5, 0),
            ),
        );
        hookSeat.getComponent("leashable").leash(projectile);

        hookSeat.setDynamicProperty("grapple:owner", player.name);
        hookSeat.setDynamicProperty("grapple:ownerID", player.id);
        hookSeat["hookEntity"] = projectile;

        grappleData.gasUsage =
            grappleData.gasUsage == undefined ? 0.0 : grappleData.gasUsage;
        grappleData.isGrappling = true;
        grappleData.hookSeat = hookSeat;
        grappleData.targetLocation = new Vector3Builder(projectile.location);
        grappleData.grappleStart = system.currentTick;
        grappleData.initialViewVector = new Vector3Builder(
            player.getViewDirection(),
        );
        grappleData.playerGasObjectiveSound = false;

        player.onScreenDisplay.setHudVisibility(0, [HudElement.HorseHealth]);

        hookSeat.getComponent("rideable").addRider(player);

    }
}
