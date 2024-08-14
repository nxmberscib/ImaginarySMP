import {
    Entity,
    EntityDieAfterEvent,
    EntityHurtAfterEvent,
    ItemStack,
    Player,
    PlayerInteractWithEntityBeforeEvent,
    system,
    world,
} from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";
import { MobNameRegistry } from "nxmbers/src/manager/MobNameManager";
import WithLogger from "nxmbers/src/util/WithLogger";
import Mixin from "teseract/api/util/Mixin";
import Runnable from "teseract/api/util/Runnable";

declare module "@minecraft/server" {
    interface Player {
        getInterstellarTrappedData(): SlimeVictim;
    }
}

interface SlimeVictim {
    victimId: string;
    id: string;
    slime: Entity;
    remaining: number;
    isTrapped: boolean;
}

// @ts-ignore
Player.prototype.getInterstellarTrappedData = function () {
    return this[`trapped:interstellar_slime`];
};

export default class InterstellarSlimeEntity
    extends Mixin(Runnable, WithLogger)
    implements MobNameRegistry
{
    public MOB_ID: string = "cib:interstellar_slime";
    public displayName: string = "§dSlime Interestelar";

    constructor() {
        super();
        
        world.beforeEvents.playerInteractWithEntity.subscribe(
            this.cancelInteraction.bind(this),
        );

        world.afterEvents.entityHurt.subscribe(this.attackEffects.bind(this));
        world.afterEvents.entityDie.subscribe(this.onDied.bind(this));
        
        this.runTimer(1);
    }

    public override *onRunJob() {
        for (const player of world.getAllPlayers()) {
            const data = player.getInterstellarTrappedData();

            if (!data) {
                continue;
            }

            if (data?.remaining <= 0) {
                data.isTrapped = false;
                continue;
            }

            if (!data?.slime.isValid()) {
                data.remaining = 0;
                data.isTrapped = false;
                continue;
            }

            data.slime.getComponent("rideable").addRider(player);
            // data.slime.runCommand(`ride "${player.name}" start_riding @s`);
            data.remaining = data.remaining - 1;

            yield;
        }
    }

    private onDied(event: EntityDieAfterEvent) {
        if (event.deadEntity.typeId != this.MOB_ID) {
            return;
        }
        if (Math.random() > 0.3) {
            return;
        }
        event.deadEntity.dimension.spawnItem(
            new ItemStack("cib:slime_wand"),
            event.deadEntity.location,
        );
    }

    private forceRide(player: Player, entity: Entity) {
        const data = {
            isTrapped: true,
            id: entity.id,
            victimId: player.id,
            slime: entity,
            remaining: 80,
        };

        player["trapped:interstellar_slime"] = data;
    }

    private cancelInteraction(arg: PlayerInteractWithEntityBeforeEvent) {
        if (arg.target?.typeId != "cib:interestellar_slime") {
            return;
        }
        arg.cancel = true;
    }

    private attackEffects(arg: EntityHurtAfterEvent) {
        try {
            const { hurtEntity: player, damageSource } = arg;
            if (
                !(player instanceof Player) ||
                damageSource.damagingEntity?.typeId != "cib:interstellar_slime"
            ) {
                return;
            }

            const random = Math.random();
            const trappedData = player.getInterstellarTrappedData();
            player.runCommand(`setblock ~~4~ pointed_dripstone`);
            let chance = Math.random() * 101;
            if (chance <= 50) {
                player.runCommand(
                    `summon tnt_minecart ~~5~ 0 0 minecraft:on_prime`,
                );
            }
            switch (true) {
                case random < 0.3 && !trappedData?.isTrapped:
                    {
                        this.forceRide(player, damageSource.damagingEntity);
                    }
                    break;

                case random > 0.3:
                    {
                        const direction =
                            damageSource.damagingEntity.getViewDirection();
                        const magnitude = Math.sqrt(
                            direction.x ** 2 + direction.z ** 2,
                        );
                        const normalized = {
                            x: direction.x / magnitude,
                            y: 0.8,
                            z: direction.x / magnitude,
                        };
                        player.applyKnockback(
                            normalized.x,
                            normalized.z,
                            magnitude,
                            normalized.y,
                        );
                    }
                    break;
            }
        } catch (error) {
            this.logger().error(error);
        }

        // player.addEffect("slowness", 20 * 3, { amplifier: 4, showParticles: false })
        // const dimension = player.dimension

        // for (let i = 0; i < 3; i++) {
        //     dimension.spawnEntity("minecraft:bee", player.location)
        // }
    }
}
