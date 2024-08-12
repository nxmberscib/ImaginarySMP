import { Player } from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";

interface ObtainableItem {
    itemId: string;
    obtainedCallback: (player: Player) => void;
    unobtainedCallback: (player: Player) => void;
}

export default class ItemRegistries {
    private OBTAINABLE_PREFIX: string = "obtainable:";
    private obtainableItems: Map<string, ObtainableItem>;

    public obtainableItemsRegistry() {
        return this.obtainableItems;
    }

    public constructor() {
        this.obtainableItems = new Map();
        Imaginary.logger().debug("ItemRegistries initialized");
    }

    public setObtainedItem(
        player: Player,
        item: ObtainableItem,
        obtained: boolean,
    ) {
        player.setDynamicProperty(
            this.OBTAINABLE_PREFIX + item.itemId,
            obtained,
        );
    }

    public hasObtainedItem(player: Player, item: ObtainableItem) {
        return player.getDynamicProperty(this.OBTAINABLE_PREFIX + item.itemId);
    }

    public registerObtainable(item: ObtainableItem) {
        this.obtainableItems.set(item.itemId, item);
        Imaginary.logger().debug("Obtainable item registered: " + item.itemId);
    }

    public unregisterObtainable(item: string): void;
    public unregisterObtainable(item: ObtainableItem | string): void | boolean {
        Imaginary.logger().debug(
            "Obtainable item unregistered: " +
                (typeof item === "string" ? item : item.itemId),
        );

        if (typeof item === "string") {
            return this.obtainableItems.delete(item);
        }

        return this.obtainableItems.delete(item.itemId);
    }
}
