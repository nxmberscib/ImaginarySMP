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

export default class Imaginary {
    #muteManager: MuteManager;
    #banManager: BanManager;
    #slotManager: SlotManager;
    #mobNameManager: MobNameManager;

    static #instance: Imaginary;
    static #logger: Logger;

    public static logger() {
        return this.#logger;
    }

    public static getInstance() {
        return this.#instance;
    }

    public onInitialized() {
        EntityResurrectEventSignal.initialize();
        Imaginary.#instance = this;
        Imaginary.#logger = new Logger("imaginary", true);

        this.initializeGamerules();

        this.#banManager = new BanManager();

        this.#muteManager = new MuteManager();

        this.#slotManager = new SlotManager();
        this.#slotManager.startLocker();

        this.#mobNameManager = new MobNameManager();

        ImaginaryCommands.registerCommands();
        ImaginaryItems.registerItems();
        ImaginaryEntities.registerEntities();

        Imaginary.logger().info("Imaginary was successfully enabled");
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

    public getMobNameManager() {
        return this.#mobNameManager;
    }
    public getBanManager() {
        return this.#banManager;
    }
    public getMuteManager() {
        return this.#muteManager;
    }
    public getSlotManager() {
        return this.#slotManager;
    }
}
