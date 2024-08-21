import { Entity, EntityHurtAfterEvent, Player, world } from "@minecraft/server";
import { MobNameRegistry } from "../../../manager/MobNameManager";
import Imaginary from "../../../Imaginary";
import Runnable from "teseract/api/util/Runnable";
import OpossumRideAttackInfo from "./OpossumRideAttackInfo";
import TimerUtils from "teseract/api/util/TimerUtils";
import { Vector3Builder } from "nxmbers/src/util/vector/VectorWrapper";

export default class OpossumEntity implements MobNameRegistry {
    public readonly MOB_ID: string = "cib:opossum";
    public readonly CLOUD_ID: string = "cib:opossum_cloud";
    public readonly displayName: string = "§7Sarigüeya";
    private readonly rideAttackInfo: Map<string, OpossumRideAttackInfo> =
        new Map();

    public constructor() {
        world.afterEvents.entityHurt.subscribe(this.onAttack.bind(this));
        Imaginary.getMobNameManager().addRegistry(this);
        Imaginary.LOGGER.robust("Opossum entity loaded");
    }

    /**
     * @deprecated
     */
    public *onRunJob(): Generator<void, void, void> {
        for (const player of world.getAllPlayers()) {
            const targetId = player.id;
            const attackInfo = this.rideAttackInfo.get(targetId);
            yield;
            Imaginary.LOGGER.debug(
                attackInfo?.opossumTarget?.isSneaking,
                Date.now() > attackInfo?.attackEnd,
            );
            if (!attackInfo?.opossumAttacker) {
                continue;
            }
            if (attackInfo.cooldown > 0) {
                attackInfo.cooldown -= 1;
                continue;
            }
            if (
                Date.now() > attackInfo.attackEnd ||
                attackInfo.opossumTarget.isSneaking
            ) {
                attackInfo.cooldown = TimerUtils.fromSecondsToTicks(2);
                attackInfo.opossumTarget
                    .getComponent("rideable")
                    .ejectRider(attackInfo.opossumAttacker);
                attackInfo.opossumAttacker = undefined;
                continue;
            }
            attackInfo.opossumTarget
                .getComponent("rideable")
                .addRider(attackInfo.opossumAttacker);
            attackInfo.opossumAttacker.teleport(
                new Vector3Builder(
                    attackInfo.opossumAttacker.location,
                ).add(attackInfo.opossumAttacker.getViewDirection()).scale(-1),
            );
        }
    }

    /**
     * @deprecated
     */
    private startRideAttack(opossum: Entity, target: Player) {
        if (
            this.rideAttackInfo.has(target.id) &&
            this.rideAttackInfo.get(target.id)?.cooldown > 0
        ) {
            return;
        }

        this.rideAttackInfo.set(target.id, {
            attackEnd: Date.now() + TimerUtils.fromSecondsToMilliseconds(10),
            attackStart: Date.now(),
            opossumTarget: target,
            opossumAttacker: opossum,
            cooldown: 0,
        });
    }

    private onAttack(event: EntityHurtAfterEvent) {
        try {
            const {
                hurtEntity: player,
                damageSource: { damagingEntity: opossum },
            } = event;

            if (!(player instanceof Player) || opossum?.typeId != this.MOB_ID) {
                return;
            }

            const random = Math.random();

            switch (true) {
                case random < 0.3:
                    {
                        // this.startRideAttack(opossum, player);
                    }
                    break;
                case random > 0.3 && random < 0.6:
                    {
                        opossum.dimension.spawnEntity(
                            this.CLOUD_ID,
                            opossum.location,
                        );
                    }
                    break;
            }
        } catch (error) {
            Imaginary.LOGGER.error(error);
        }
    }
}
