import { ItemLockMode, ItemStack, world, Player } from "@minecraft/server";
import Mixin from "teseract/api/util/Mixin";
import Runnable from "teseract/api/util/Runnable";
import Imaginary from "../Imaginary";

export default class SlotManager extends Runnable {
    public constructor() {
        super();
        this.runTimer(5);
        Imaginary.LOGGER.info("Slot manager loaded");
    }

    public lockAllSlots(player: Player) {
        for (let i = 0; i < 36; i++) {
            this.lockSlot(player, i);
        }
    }

    public unlockAllSlots(player: Player) {
        for (let i = 0; i < 36; i++) {
            this.unlockSlot(player, i);
        }
    }

    public override *onRunJob() {
        for (const player of world.getAllPlayers()) {
            const inventory = player.getComponent("inventory");
            const container = inventory.container;

            for (let i = 0; i < 36; i++) {
                const isLocked = player.getDynamicProperty("slot:" + i);
                const slot = container.getSlot(i);
                if (!isLocked) {
                    if (slot.getItem()?.typeId == "ha:barrier_fake")
                        slot.setItem();
                    continue;
                }
                const item = new ItemStack("ha:barrier_fake");
                if (
                    slot?.getItem()?.typeId != "ha:barrier_fake" &&
                    slot.getItem()
                ) {
                    player.dimension.spawnItem(slot.getItem(), player.location);
                }
                item.lockMode = ItemLockMode.slot;
                container.setItem(i, item);
                yield;
            }
            yield;
        }
    }

    /**
     *
     * @param player
     * @param slotId
     */
    public lockSlot(player: Player, slotId: number) {
        player.setDynamicProperty("slot:" + slotId, true);
        Imaginary.LOGGER.robust(
            `Slot ${slotId} locked for player '${player.name}'`,
        );
    }
    /**
     *
     * @param player
     * @param slotId
     */
    public unlockSlot(player: Player, slotId: number) {
        player.setDynamicProperty("slot:" + slotId, false);
        Imaginary.LOGGER.robust(
            `Slot ${slotId} unlocked for player '${player.name}'`,
        );
    }

    /**
     *
     * @param player
     * @param slotId
     */
    public isLocked(player: Player, slotId: number) {
        const isLocked = player.getDynamicProperty("slot:" + slotId);
        return !isLocked ? false : true;
    }
}
