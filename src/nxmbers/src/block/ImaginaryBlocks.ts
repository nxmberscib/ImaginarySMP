import Imaginary from "../Imaginary";
import BrewingStandBlock from "./BrewingStandBlock";
import ChestBlock from "./ChestBlock";
import EnchantmentTableBlock from "./EnchantmentTableBlock";
import GrindstoneBlock from "./GrindstoneBlock";

export default class ImaginaryBlocks {
    public static registerBlocks() {
        new BrewingStandBlock();
        new ChestBlock();
        new EnchantmentTableBlock();
        new GrindstoneBlock();
        Imaginary.logger().info("Imaginary Blocks loaded");
    }
}
