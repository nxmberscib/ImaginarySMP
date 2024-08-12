import {
    ItemLockMode,
    ItemStack,
    Player,
    system,
    world,
} from "@minecraft/server";
import WithLogger from "../util/WithLogger";

export default class SlotManager extends WithLogger {
    public startLocker() {
        // world.afterEvents.entitySpawn.subscribe((arg) => {
        //     if (arg.entity?.typeId != "minecraft:item") {
        //         return;
        //     }
        //     if (!arg.entity.isValid()) {
        //         return;
        //     }
        //     if (arg.entity?.getComponent("item").itemStack.typeId != "ha:barrier_fake")
        //         return;

        //     arg.entity.remove()
        // })
        system.runInterval(() => system.runJob(this.#lockedProtocol()), 10);
        this.logger().info("Slot manager initialized");
    }

    *#lockedProtocol() {
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
    }
    /**
     *
     * @param player
     * @param slotId
     */
    public unlockSlot(player: Player, slotId: number) {
        player.setDynamicProperty("slot:" + slotId, false);
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
