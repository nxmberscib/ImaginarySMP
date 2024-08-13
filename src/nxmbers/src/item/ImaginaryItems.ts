import WithLogger from "../util/WithLogger";
import ChipoteChillonItem from "./ChipoteChillonItem";

export default class ImaginaryItems extends WithLogger {
    public static CHIPOTE_CHILLON: ChipoteChillonItem;

    public static registerItems() {
        this.CHIPOTE_CHILLON = new ChipoteChillonItem();
        this.logger().info("Imaginary items loaded");
    }
}
