import Imaginary from "../Imaginary";
import WithLogger from "../util/WithLogger";
import AureumFulminatorItem from "./AureumFulminatorItem";
import ChipoteChillonItem from "./ChipoteChillonItem";
import GrapplingHandle from "./grappling/GrapplingHookItem";
import SlimeWandItem from "./SlimeWandItem";

export default class ImaginaryItems extends WithLogger {
    public static CHIPOTE_CHILLON: ChipoteChillonItem;
    public static SLIME_WAND: SlimeWandItem;
    public static AUREUM_FULMINATOR: AureumFulminatorItem;
    static GRAPPLING_HOOK: GrapplingHandle;

    public static registerItems() {
        this.CHIPOTE_CHILLON = new ChipoteChillonItem();
        this.SLIME_WAND = new SlimeWandItem();
        this.AUREUM_FULMINATOR = new AureumFulminatorItem();
        this.GRAPPLING_HOOK = new GrapplingHandle()

        Imaginary.LOGGER.info("Imaginary items loaded");
    }
}
