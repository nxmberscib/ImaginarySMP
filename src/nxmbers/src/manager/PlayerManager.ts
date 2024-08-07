// @ts-check

import { Player, ScoreboardObjective, world } from "@minecraft/server";
import BanManager from "./BanManager";

export default class PlayerManager {
    public getBanManager() {
        return BanManager; 
    }
}