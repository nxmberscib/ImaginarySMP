import { Player } from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";
import ObtainableItem from "./interface/ObtainableItem";

export default class ItemRegistries {
    private OBTAINABLE_PREFIX: string = "obtained:";
    private obtainableItems: Map<string, ObtainableItem>;

    public obtainableItemsRegistry() {
        return this.obtainableItems;
    }

    public constructor() {
        this.obtainableItems = new Map();
        Imaginary.LOGGER.debug("ItemRegistries initialized");
    }

    public setObtainedItem(
        player: Player,
        item: ObtainableItem,
        obtained: boolean,
    ) {
        player.setDynamicProperty(
            this.OBTAINABLE_PREFIX + item.ITEM_ID,
            obtained,
        );
        if (obtained == false) {
            item.unobtainedCallback(player);
        }
    }

    public hasObtainedItem(player: Player, item: ObtainableItem) {
        return player.getDynamicProperty(this.OBTAINABLE_PREFIX + item.ITEM_ID);
    }

    public registerObtainable(item: ObtainableItem) {
        this.obtainableItems.set(item.ITEM_ID, item);
        Imaginary.LOGGER.debug("Obtainable item registered: " + item.ITEM_ID);
    }

    public unregisterObtainable(item: string): void;
    public unregisterObtainable(item: ObtainableItem | string): void | boolean {
        Imaginary.LOGGER.debug(
            "Obtainable item unregistered: " +
                (typeof item === "string" ? item : item.ITEM_ID),
        );

        if (typeof item === "string") {
            return this.obtainableItems.delete(item);
        }

        return this.obtainableItems.delete(item.ITEM_ID);
    }
}
