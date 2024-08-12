import SlotManager from "./manager/SlotManager";
import ImaginaryEntities from "./entity/ImaginaryEntities";
import BanManager from "./manager/BanManager";
import { GameRules, world } from "@minecraft/server";
import ImaginaryCommands from "./command/ImaginaryCommands";
import {
    EntityResurrectEvent,
    EntityResurrectEventSignal,
} from "teseract/api/event/EntityResurrectEvent";
import MuteManager from "./manager/MuteManager";
import Logger from "teseract/api/Logger";
import ImaginaryItems from "./item/ImaginaryItems";

export default class Imaginary {
    #muteManager: MuteManager;
    #banManager: BanManager;
    #slotManager: SlotManager;

    static #instance: Imaginary;

    static readonly #logger = new Logger("imaginary", true);

    public static logger() {
        return this.#logger;
    }

    public static getInstance() {
        return this.#instance;
    }

    public onInitialized() {
        EntityResurrectEventSignal.initialize();
        Imaginary.#instance = this;
        // import "./block/Block"
        // import './item/Item'

        ImaginaryCommands.registerCommands();

        this.initializeGamerules();

        ImaginaryItems.registerItems();

        ImaginaryEntities.registerEntities();

        this.#banManager = new BanManager();
        this.#banManager.setupBanSystem();
        this.#banManager.startBanProtocol();

        this.#muteManager = new MuteManager();
        this.#muteManager.startMuteProtocol();

        this.#slotManager = new SlotManager();
        this.#slotManager.startLocker();

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
