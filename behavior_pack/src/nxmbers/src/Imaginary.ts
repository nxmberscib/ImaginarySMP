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
import ImaginaryBlocks from "./block/ImaginaryBlocks";

export default class Imaginary {
    private static fastTotemManager: FastTotemManager;
    private static itemManager: ItemManager;
    private static muteManager: MuteManager;
    private static banManager: BanManager;
    private static slotManager: SlotManager;
    private static mobNameManager: MobNameManager;
    private static discordManager: DiscordManager;

    private static instance: Imaginary;
    public static LOGGER: Logger = new Logger("imaginary", true);

    public static logger() {
        return this.logger;
    }
    
    public onInitialized() {
        EntityResurrectEventSignal.initialize();
        this.initializeGamerules();

        Imaginary.instance = this;

        Imaginary.fastTotemManager = new FastTotemManager();
        Imaginary.itemManager = new ItemManager();
        Imaginary.banManager = new BanManager();
        Imaginary.muteManager = new MuteManager();
        Imaginary.slotManager = new SlotManager();
        Imaginary.mobNameManager = new MobNameManager();
        Imaginary.discordManager = new DiscordManager();

        ImaginaryCommands.registerCommands();
        ImaginaryItems.registerItems();
        ImaginaryEntities.registerEntities();
        ImaginaryBlocks.registerBlocks()

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
        return this.fastTotemManager;
    }

    public static getItemManager() {
        return this.itemManager;
    }

    public static getMobNameManager() {
        return this.mobNameManager;
    }

    public static getBanManager() {
        return this.banManager;
    }

    public static getMuteManager() {
        return this.muteManager;
    }

    public static getSlotManager() {
        return this.slotManager;
    }

    public static getDiscordManager() {
        return this.discordManager;
    }
}
