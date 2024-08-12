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
    static registerEntities() {
        // Player
        ImaginaryPlayer.registerPlayerBehaviors();

        // Skeletons
        new BreezeSkeletonEntity();
        new CrystallineSkeletonEntity();

        // Slimes
        new HoneySlimeEntity();
        new InterstellarSlimeEntity();
        new MarineSlimeEntity();

        // Piglins
        new FrozenPiglinEntity();

        // Illagers
        new PreassureAssasinEntity();

        new BreezeEntity();

        Imaginary.logger().info("Imaginary Entities loaded");
    }
}
