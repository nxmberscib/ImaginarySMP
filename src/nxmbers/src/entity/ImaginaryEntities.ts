// @ts-check

import FrozenPiglinEntity from "./piglin/FrozenPiglinEntity";
import HoneySlimeEntity from "./slime/HoneySlimeEntity";
import InterstellarSlimeEntity from "./slime/InterstellarSlimeEntity";
import MarineSlimeEntity from "./slime/MarineSlimeEntity";
import PreassureAssasinEntity from "./illager/PreassureAssasinEntity";
import ImaginaryPlayer from "./player/ImaginaryPlayer";
import Imaginary from "../Imaginary";
import BreezeSkeletonEntity from "./skeleton/BreezeSkeletonEntity";
import CrystallineSkeletonEntity from "./skeleton/CrystallineSkeletonEntity";
import BreezeEntity from "./BreezeEntity";

export default class ImaginaryEntities {
    private static logger() {
        return Imaginary.logger();
    }

    public static BREEZE_SKELETON: BreezeSkeletonEntity;
    public static CRYSTALLINE_SKELETON: CrystallineSkeletonEntity;
    public static HONEY_SLIME: HoneySlimeEntity;
    public static INTERSTELLAR_SLIME: InterstellarSlimeEntity;
    public static MARINE_SLIME: MarineSlimeEntity;
    public static FROZEN_PIGLIN: FrozenPiglinEntity;
    public static PREASSURE_ASSASIN: PreassureAssasinEntity;
    public static BREEZE: BreezeEntity;

    public static registerEntities() {
        // Player
        ImaginaryPlayer.registerPlayerBehaviors();

        // Skeletons
        this.BREEZE_SKELETON = new BreezeSkeletonEntity();
        this.CRYSTALLINE_SKELETON = new CrystallineSkeletonEntity();

        // Slimes
        this.HONEY_SLIME = new HoneySlimeEntity();
        this.INTERSTELLAR_SLIME = new InterstellarSlimeEntity();
        this.MARINE_SLIME = new MarineSlimeEntity();

        // Piglins
        this.FROZEN_PIGLIN = new FrozenPiglinEntity();

        // Illagers
        this.PREASSURE_ASSASIN = new PreassureAssasinEntity();

        // Vanilla entities
        this.BREEZE = new BreezeEntity();

        this.logger().info("Imaginary Entities loaded");
    }
}
