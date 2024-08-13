import WithLogger from "../util/WithLogger";
import ChipoteChillonItem from "./ChipoteChillonItem";
import SlimeWandItem from "./SlimeWandItem";

export default class ImaginaryItems extends WithLogger {
    public static CHIPOTE_CHILLON: ChipoteChillonItem;
    public static SLIME_WAND: SlimeWandItem;

    public static registerItems() {
        this.CHIPOTE_CHILLON = new ChipoteChillonItem();
        this.SLIME_WAND = new SlimeWandItem();

        this.logger().info("Imaginary items loaded");
    }
}
