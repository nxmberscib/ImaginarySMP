import SlotManager from "./manager/SlotManager";
import ImaginaryEntities from "./entity/ImaginaryEntities";
import BanManager from "./manager/BanManager";
import { GameRules, world } from "@minecraft/server";
import ImaginaryCommands from "./command/ImaginaryCommands";
import { EntityResurrectEvent, EntityResurrectEventSignal } from "teseract/api/event/EntityResurrectEvent";
import ChipoteChillon from "./item/ChipoteChillon";
import MuteManager from "./manager/MuteManager";

export default class Imaginary {
    static #instance: Imaginary;
    #muteManager: MuteManager;
    public static getInstance() {
        return this.#instance;
    }
    #banManager: BanManager;
    #slotManager: SlotManager;

    public onInitialized() {
        EntityResurrectEventSignal.initialize();
        new ChipoteChillon();
        Imaginary.#instance = this;
        // import "./block/Block"
        // import './item/Item'

        ImaginaryCommands.registerCommands();

        this.initializeGamerules();

        /**
         * @remarks
         * Initializes all the Imaginary custom and vanilla entities.
         */
        ImaginaryEntities.registerEntities();

        /**
         * @remarks
         * Initializes the ban manager.
         */
        this.#banManager = new BanManager();
        this.#banManager.setupBanSystem();
        this.#banManager.startBanProtocol();

        /**
         * @remarks
         * Initializes the mute manager.
         */
        this.#muteManager = new MuteManager()
        this.#muteManager.startMuteProtocol();

        /**
         * @remarks
         * Initializes the slot manager.
         */
        this.#slotManager = new SlotManager();
        this.#slotManager.startLocker();
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
