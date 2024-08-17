import { ItemStack, Player, world } from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";
import Runnable from "teseract/api/util/Runnable";
import CommandAlias from "teseract/api/command/CommandAlias";
import SubCommand from "teseract/api/command/SubCommand";
import CommandManager from "teseract/api/command/CommandManager";
import Permission from "teseract/api/command/Permission";

@CommandAlias("-obtainable")
@Permission((p) => p.hasTag("admin") || p.isOp())
export default class ObtainableItemsThread extends Runnable {
    public constructor() {
        super();
        this.runTimer(5);
        CommandManager.registerCommand(this);
        Imaginary.LOGGER.info("Obtainable items thread loaded and running");
    }

    @SubCommand("--reset")
    private onReset(sender: Player, obtainable: string, target: Player) {
        const registries = Imaginary.getItemManager().getRegistries();
        if (!registries.obtainableItemsRegistry().has(obtainable)) {
            return sender.sendMessage(`§cUknown obtainable item: '${obtainable}' is not a registered obtainable item.`)
        }
        registries.setObtainedItem(
            target,
            registries.obtainableItemsRegistry().get(obtainable),
            false,
        );
        sender.sendMessage(`§7Obtainable item '${obtainable}' was reset for player '${target.name}'`)
    }

    private formatObtainable(id: string) {
        return `obtained:${id}`;
    }

    private getInventory(player: Player) {
        const items: ItemStack[] = [];
        const inventory = player.getComponent("inventory").container;
        for (let i = 0; i <= inventory.size; i++) {
            items.push(inventory.getItem(i));
        }
        return items;
    }

    private getInventoryStrings(player: Player) {
        const items: string[] = [];
        const inventory = player.getComponent("inventory").container;
        for (let i = 0; i < inventory.size; i++) {
            items.push(inventory.getItem(i)?.typeId ?? "minecraft:air");
        }
        return items;
    }

    public override *onRunJob(): Generator<any, any, any> {
        try {
            Imaginary.LOGGER.robust("ObtainableItemsThread executed");
            for (const player of world.getAllPlayers()) {
                for (const [id, obtainable] of Imaginary.getItemManager()
                    .getRegistries()
                    .obtainableItemsRegistry()
                    .entries()) {
                    const obtainableId = this.formatObtainable(id);

                    if (player.getDynamicProperty(obtainableId)) {
                        continue;
                    }

                    if (
                        !this.getInventoryStrings(player).includes(
                            obtainable.ITEM_ID,
                        )
                    ) {
                        continue;
                    }

                    obtainable.obtainedCallback(player);
                    player.setDynamicProperty(obtainableId, true);
                    yield;
                }
                yield;
            }
        } catch (error) {
            Imaginary.LOGGER.error(error);
        }
    }
}
