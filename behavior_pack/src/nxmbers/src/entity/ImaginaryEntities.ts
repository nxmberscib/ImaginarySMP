import FrozenPiglinEntity from "./piglin/FrozenPiglinEntity";
import HoneySlimeEntity from "./slime/HoneySlimeEntity";
import InterstellarSlimeEntity from "./slime/InterstellarSlimeEntity";
import MarineSlimeEntity from "./slime/MarineSlimeEntity";
import PreassureAssasinEntity from "./illager/PreassureAssasinEntity";
import ImaginaryPlayer from "./player/ImaginaryPlayer";
import BreezeSkeletonEntity from "./skeleton/BreezeSkeletonEntity";
import CrystallineSkeletonEntity from "./skeleton/CrystallineSkeletonEntity";
import BreezeEntity from "./BreezeEntity";
import OpossumEntity from "./opossum/OpossumEntity";
import WithLogger from "../util/WithLogger";
import VexEntity from "./VexEntity";
import Imaginary from "../Imaginary";
import JirafitaEntity from "./llama/JirafitaEntity";
import DeepCreeperEntity from "./creeper/DeepCreeperEntity";
import DeepSpiderEntity from "./spider/DeepSpiderEntity";
import { Effect } from "@minecraft/server";
import DrownedEntity from "./DrownedEntity";
import DeepSkeletonEntity from "./skeleton/DeepSkeletonEntity";
import DiabloquitoEntity from "./DiabloquitoEntity";

export default class ImaginaryEntities {
    public static OPOSSUM: OpossumEntity;
    public static BREEZE_SKELETON: BreezeSkeletonEntity;
    public static CRYSTALLINE_SKELETON: CrystallineSkeletonEntity;
    public static HONEY_SLIME: HoneySlimeEntity;
    public static INTERSTELLAR_SLIME: InterstellarSlimeEntity;
    public static MARINE_SLIME: MarineSlimeEntity;
    public static FROZEN_PIGLIN: FrozenPiglinEntity;
    public static PREASSURE_ASSASIN: PreassureAssasinEntity;
    public static DIABLOQUITO: DiabloquitoEntity;
    public static BREEZE: BreezeEntity;
    public static VEX: VexEntity;
    public static JIRAFITA: JirafitaEntity;
    public static DEEP_CREEPER: DeepCreeperEntity;
    public static DEEP_SPIDER: DeepSpiderEntity;
    public static DROWNED: DrownedEntity;
    public static DEEP_SKELETON: DeepSkeletonEntity;

    public static registerEntities() {
        // Player
        ImaginaryPlayer.registerPlayerBehaviors();
        // Foxes
        this.OPOSSUM = new OpossumEntity();

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

        this.DIABLOQUITO = new DiabloquitoEntity();

        // Vanilla entities
        this.BREEZE = new BreezeEntity();
        this.VEX = new VexEntity();

        this.DROWNED = new DrownedEntity();

        this.JIRAFITA = new JirafitaEntity();

        this.DEEP_CREEPER = new DeepCreeperEntity();
        this.DEEP_SPIDER = new DeepSpiderEntity();
        this.DEEP_SKELETON = new DeepSkeletonEntity();

        Imaginary.LOGGER.info("Imaginary entities loaded");
    }
}
