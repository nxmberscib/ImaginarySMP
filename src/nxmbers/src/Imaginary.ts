import { world } from "@minecraft/server";
import { EntityResurrectEventSignal } from "teseract/api/event/EntityResurrectEvent";
import SlotManager from "./manager/SlotManager";
import ImaginaryEntities from "./entity/ImaginaryEntities";
import BanManager from "./moderation/ban/BanManager";
import ImaginaryCommands from "./command/ImaginaryCommands";
import Logger from "teseract/api/Logger";
import ImaginaryItems from "./item/ImaginaryItems";
import MuteManager from "./moderation/mute/MuteManager";
import MobNameManager from "./manager/MobNameManager";
import ItemManager from "./item/manager/ItemManager";
import DiscordManager from "./discord/DiscordManager";
import FastTotemManager from "./fast_totem/FastTotemManager";

export default class Imaginary {
    #fastTotemManager: FastTotemManager;
    #itemManager: ItemManager;
    #muteManager: MuteManager;
    #banManager: BanManager;
    #slotManager: SlotManager;
    #mobNameManager: MobNameManager;
    #discordManager: DiscordManager;

    static #instance: Imaginary;
    public LOGGER: Logger = new Logger("imaginary", true);
    public static LOGGER: Logger = new Logger("imaginary", true);

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

        this.#fastTotemManager = new FastTotemManager();
        this.#itemManager = new ItemManager();
        this.#banManager = new BanManager();
        this.#muteManager = new MuteManager();
        this.#slotManager = new SlotManager();
        this.#mobNameManager = new MobNameManager();
        this.#discordManager = new DiscordManager();

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

    public static getFastTotemManager() {
        return this.getInstance().#fastTotemManager;
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

    public static getDiscordManager() {
        return this.getInstance().#discordManager;
    }
}
