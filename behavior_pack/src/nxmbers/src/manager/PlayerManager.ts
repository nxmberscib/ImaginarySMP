// @ts-check

import { Player, ScoreboardObjective, world } from "@minecraft/server";
import BanManager from "../moderation/ban/BanManager";

export default class PlayerManager {
    public getBanManager() {
        return BanManager; 
    }
}