import SlotManager from "./manager/SlotManager";
import ImaginaryEntities from "./entity/ImaginaryEntities";
import BanManager from "./moderation/ban/BanManager";
import { GameRules, world } from "@minecraft/server";
import ImaginaryCommands from "./command/ImaginaryCommands";
import {
    EntityResurrectEvent,
    EntityResurrectEventSignal,
} from "teseract/api/event/EntityResurrectEvent";
// import MuteManager from "./manager/MuteManager";
import Logger from "teseract/api/Logger";
import ImaginaryItems from "./item/ImaginaryItems";
import MuteManager from "./moderation/mute/MuteManager";
import MobNameManager from "./manager/MobNameManager";
import ItemManager from "./item/manager/ItemManager";

export default class Imaginary {
    #itemManager: ItemManager;
    #muteManager: MuteManager;
    #banManager: BanManager;
    #slotManager: SlotManager;
    #mobNameManager: MobNameManager;

    static #instance: Imaginary;
    public LOGGER: Logger =  new Logger("imaginary", true);
    public static LOGGER: Logger =  new Logger("imaginary", true);

    public static logger() {
        return this.logger;
    }

    private static getInstance() {
        return this.#instance;
    }

    public onInitialized() {
        EntityResurrectEventSignal.initialize();
        this.initializeGamerules();

        Imaginary.#instance = this;

        this.#itemManager = new ItemManager();
        this.#banManager = new BanManager();
        this.#muteManager = new MuteManager();
        this.#slotManager = new SlotManager();
        this.#mobNameManager = new MobNameManager();

        ImaginaryCommands.registerCommands();
        ImaginaryItems.registerItems();
        ImaginaryEntities.registerEntities();

        Imaginary.LOGGER.info("Imaginary was successfully loaded");
    }

    public initializeGamerules() {
        world.gameRules.commandBlockOutput = false;
        world.gameRules.doImmediateRespawn = true;
        world.gameRules.doLimitedCrafting = true;
        world.gameRules.commandBlockOutput = false;
        world.gameRules.doImmediateRespawn = true;
        world.gameRules.doLimitedCrafting = true;
        world.gameRules.keepInventory = true;
        world.gameRules.pvp = false;
        world.gameRules.randomTickSpeed = 2;
        world.gameRules.recipesUnlock = true;
        world.gameRules.showBorderEffect = true;
        world.gameRules.showCoordinates = true;
        world.gameRules.showRecipeMessages = true;
        world.gameRules.showTags = true;
        world.gameRules.spawnRadius = 0;
    }

    public static getItemManager() {
        return this.getInstance().#itemManager;
    }

    public static getMobNameManager() {
        return this.getInstance().#mobNameManager;
    }

    public static getBanManager() {
        return this.getInstance().#banManager;
    }

    public static getMuteManager() {
        return this.getInstance().#muteManager;
    }

    public static getSlotManager() {
        return this.getInstance().#slotManager;
    }

}
