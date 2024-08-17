import Imaginary from "../Imaginary";
import WithLogger from "../util/WithLogger";
import AureumFulminatorItem from "./AureumFulminatorItem";
import ChipoteChillonItem from "./ChipoteChillonItem";
import SlimeWandItem from "./SlimeWandItem";

export default class ImaginaryItems extends WithLogger {
    public static CHIPOTE_CHILLON: ChipoteChillonItem;
    public static SLIME_WAND: SlimeWandItem;
    public static AUREUM_FULMINATOR: AureumFulminatorItem;

    public static registerItems() {
        this.CHIPOTE_CHILLON = new ChipoteChillonItem();
        this.SLIME_WAND = new SlimeWandItem();
        this.AUREUM_FULMINATOR = new AureumFulminatorItem();

        Imaginary.LOGGER.info("Imaginary items loaded");
    }
}
