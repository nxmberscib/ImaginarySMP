import { Entity, EntityHurtAfterEvent, Player, world } from "@minecraft/server";
import Runnable from "teseract/api/util/Runnable";
import TimerUtils from "teseract/api/util/TimerUtils";
import { Vector3Builder } from "nxmbers/src/util/vector/VectorWrapper";
import Imaginary from "nxmbers/src/Imaginary";
import { MobNameRegistry } from "nxmbers/src/manager/MobNameManager";

export default class InfernalFoxEntity implements MobNameRegistry {
    public readonly MOB_ID: string = "cib:infernal_fox";
    public readonly displayName: string = "§cZorro Infernal";

    public constructor() {
        world.afterEvents.entityHurt.subscribe(this.onAttack.bind(this));
        Imaginary.getMobNameManager().addRegistry(this);
        Imaginary.LOGGER.robust("Infernal fox entity loaded");
    }

    private onAttack(event: EntityHurtAfterEvent) {
        try {
            const {
                hurtEntity: player,
                damageSource: { damagingEntity: infernalFox },
            } = event;

            if (
                !(player instanceof Player) ||
                infernalFox?.typeId != this.MOB_ID
            ) {
                return;
            }

            if (
                player.dimension.getBlock(player.location).typeId ==
                "minecraft:twisting_vines"
            ) {
                const effectDuration = TimerUtils.fromSecondsToTicks(4);
                player.addEffect("blindness", effectDuration, { amplifier: 4 });
                player.addEffect("weakness", effectDuration, { amplifier: 4 });
                player.addEffect("nausea", effectDuration, { amplifier: 4 });
            }

            if (Math.random() > 0.3) {
                return;
            }

            for (let x = -1; x < 3; x++) {
                for (let z = -1; z < 3; z++) {
                    for (let y = 0; y < 4; y++) {
                        const block = player.dimension.getBlock(
                            new Vector3Builder(x, y, z),
                        );
                        if (!block.isAir || block.below(1).isAir) {
                            continue;
                        }
                        block.setType("minecraft:twisting_vines");
                    }
                }
            }
        } catch (error) {
            Imaginary.LOGGER.error(error);
        }
    }
}
