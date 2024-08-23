import Imaginary from "../Imaginary";
import BrewingStandBlock from "./BrewingStandBlock";
import ChestBlock from "./ChestBlock";
import EnchantmentTableBlock from "./EnchantmentTableBlock";
import GrindstoneBlock from "./GrindstoneBlock";
import LeavesBlock from "./LeavesBlock";
import VaultBlock from "./vault/VaultBlock";

export default class ImaginaryBlocks {
    public static BREWING_STAND: BrewingStandBlock;
    public static CHEST: ChestBlock;
    public static ENCHANTMENT_TABLE: EnchantmentTableBlock;
    public static GRINDSTONE: GrindstoneBlock;
    public static LEAVES_CONTROLLER: LeavesBlock;
    public static VAULT: VaultBlock;

    public static registerBlocks() {
        this.BREWING_STAND = new BrewingStandBlock();
        this.CHEST = new ChestBlock();
        this.ENCHANTMENT_TABLE = new EnchantmentTableBlock();
        this.GRINDSTONE = new GrindstoneBlock();
        this.LEAVES_CONTROLLER = new LeavesBlock();
        this.VAULT = new VaultBlock();

        Imaginary.LOGGER.info("Imaginary Blocks loaded");
    }
}
