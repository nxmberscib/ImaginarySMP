import {
    ItemComponentUseEvent,
    ItemCustomComponent,
    world,
} from "@minecraft/server";
import Imaginary from "../Imaginary";
import { calculateKnockbackVector } from "../util/KnockbackFromPoint";
import TimerUtils from "teseract/api/util/TimerUtils";

export default class SlimeWandItem implements ItemCustomComponent {
    public readonly ITEM_ID: string = "cib:slime_wand";

    public constructor() {
        world.beforeEvents.itemUse.subscribe(this.onUse.bind(this));
        Imaginary.LOGGER.robust("Slime wand item loaded");
    }

    public async onUse(event: ItemComponentUseEvent) {
        try {
            const { itemStack: item, source: player } = event;

            if (item?.typeId != this.ITEM_ID) {
                return;
            }

            await null;

            const cooldown = player.getItemCooldown("slime_wand");

            if (cooldown != 0) {
                return;
            }

            player.dimension.playSound("mob.slime.big", player.location, {
                pitch: 0.6,
            });
            player.dimension.playSound(
                "mace.heavy_smash_ground",
                player.location,
                {
                    volume: 0.35,
                },
            );

            for (const entity of player.dimension.getEntities({
                maxDistance: 5,
                // families: ["monster"],
                excludeTypes: ["player"],
                location: player.location,
            })) {
                entity.addEffect("poison", 20 * 10);
                entity.addEffect("slowness", 20 * 10);
                const knockbackVector = calculateKnockbackVector(entity.location, player.location, 4)
                knockbackVector.y = 0.5
                entity.applyImpulse(knockbackVector)
            }

            player.startItemCooldown("slime_wand", TimerUtils.fromSecondsToTicks(15));
        } catch (error) {
            Imaginary.LOGGER.error(error);
        }
    }
}
