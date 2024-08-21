import Imaginary from "nxmbers/src/Imaginary";
import ItemRegistries from "./ItemRegistries";
import ObtainableItemsThread from "./thread/ObtainableItemsThread";

export default class ItemManager {
    private registries: ItemRegistries;

    public constructor() {
        Imaginary.LOGGER.info("ItemManager initialized");
        new ObtainableItemsThread();
        this.registries = new ItemRegistries()
    }

    public getRegistries() {
        return this.registries;
    }
}
