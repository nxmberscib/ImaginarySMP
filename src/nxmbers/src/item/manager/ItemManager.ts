import Imaginary from "nxmbers/src/Imaginary";
import ItemRegistries from "./ItemRegistries";

export default class ItemManager {
    private registries: ItemRegistries;

    public constructor() {
        Imaginary.logger().info("ItemManager initialized");
    }

    public getRegistries() {
        return this.registries;
    }
}
