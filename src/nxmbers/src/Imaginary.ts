import SlotManager from "./manager/SlotManager";
import ImaginaryEntities from "./entity/Entity";
import BanManager from "./manager/BanManager";
import { GameRules, world } from "@minecraft/server";
import ImaginaryCommands from "./command/ImaginaryCommands";

export default class Imaginary {
    static #instance: Imaginary;
    public static getInstance() {
        return this.#instance;
    }
    #banManager: BanManager;
    #slotManager: SlotManager;

    public onInitialized() {
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

    public getSlotManager() {
        return this.#slotManager;
    }
}
