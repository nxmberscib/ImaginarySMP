import { Player } from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";
import ObtainableItem from "./interface/ObtainableItem";

export default class ItemRegistries {
    private OBTAINABLE_PREFIX: string = "obtained:";
    private obtainableItems: Map<string, ObtainableItem>;

    public obtainableRegistry() {
        return this.obtainableItems;
    }

    public constructor() {
        this.obtainableItems = new Map();
        Imaginary.LOGGER.debug("ItemRegistries initialized");
    }

    public setObtainedItem(
        player: Player,
        item: ObtainableItem | string,
        obtained: boolean,
    ) {
        const obtainable =
            typeof item === "string"
                ? this.obtainableRegistry().get(item)
                : item;

        if (typeof item === "string" && !obtainable) {
            return Imaginary.LOGGER.error(
                `Obtainable '${item}' does not exist in registry`,
            );
        }

        player.setDynamicProperty(
            this.OBTAINABLE_PREFIX + obtainable.ITEM_ID,
            obtained,
        );
        if (obtained == false) {
            obtainable.unobtainedCallback(player);
        }
    }

    public hasObtainedItem(player: Player, item: ObtainableItem | string) {
        const obtainable =
            typeof item === "string"
                ? this.obtainableRegistry().get(item)
                : item;

        if (typeof item === "string" && !obtainable) {
            return Imaginary.LOGGER.error(
                `Obtainable '${item}' does not exist in registry`,
            );
        }
        return (
            (player.getDynamicProperty(
                this.OBTAINABLE_PREFIX + obtainable.ITEM_ID,
            ) as boolean) ?? false
        );
    }

    public registerObtainable(item: ObtainableItem) {
        this.obtainableItems.set(item.ITEM_ID, item);
        Imaginary.LOGGER.debug("Obtainable item registered: " + item.ITEM_ID);
    }

    public unregisterObtainable(item: string): void;
    public unregisterObtainable(item: ObtainableItem | string): void | boolean {
        const obtainable =
            typeof item === "string"
                ? this.obtainableRegistry().get(item)
                : item;

        if (typeof item === "string" && !obtainable) {
            return Imaginary.LOGGER.error(
                `Obtainable '${item}' does not exist in registry`,
            );
        }
        
        Imaginary.LOGGER.debug(
            "Obtainable item unregistered: " +
                (typeof item === "string" ? item : item.ITEM_ID),
        );

        if (typeof item === "string") {
            return this.obtainableItems.delete(item);
        }

        return this.obtainableItems.delete(obtainable.ITEM_ID);
    }
}
