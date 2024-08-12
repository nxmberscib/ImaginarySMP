// @ts-check

import { ScoreboardObjective, world, Player } from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";
import CommandManager from "teseract/api/command/CommandManager";
import UnbanCommand from "./command/UnbanCommand";
import BanCommand from "./command/BanCommand";

export default class BanManager {
    public BAN_PROTOCOL_ID = "imaginary:ban_protocol";
    public BAN_OBJECTIVE_ID = "imaginary:banned";
    public BAN_OBJECTIVE: ScoreboardObjective;

    private logger() {
        return Imaginary.logger();
    }

    /**
     *
     * @param player
     */
    private formatBanName(player: Player | string) {
        return player instanceof Player ? `{${player.name}}` : `{${player}}`;
    }

    public toggleBanProtocol() {
        const on = world.getDynamicProperty(this.BAN_PROTOCOL_ID);
        world.setDynamicProperty(
            this.BAN_PROTOCOL_ID,
            !(on === undefined ? false : on),
        );
    }

    public isEnabled(): boolean {
        const on = world.getDynamicProperty(this.BAN_PROTOCOL_ID) as boolean;
        return on;
    }

    private setupBanSystem() {
        const objective = world.scoreboard.getObjective(this.BAN_OBJECTIVE_ID);
        world.setDynamicProperty(this.BAN_PROTOCOL_ID, true);
        if (!objective) {
            this.BAN_OBJECTIVE = world.scoreboard.addObjective(
                this.BAN_OBJECTIVE_ID,
            );
        } else {
            this.BAN_OBJECTIVE = objective;
        }

        return this.BAN_OBJECTIVE;
    }

    /**
     *
     * @param player
     */
    public banPlayer(player: Player | string) {
        this.BAN_OBJECTIVE?.setScore(this.formatBanName(player), 1);
        if (!(player instanceof Player) || !player.isValid()) {
            return;
        }
        player.removeTag("inCinematic");
        player.runCommand(`kick "${player.name}"`);
    }

    /**
     *
     */
    public isBanned(player: Player | string) {
        const isBanned = this.BAN_OBJECTIVE.getScore(
            this.formatBanName(player),
        );

        return !isBanned ? false : true;
    }

    /**
     * Unbans or pardon a player.
     * @remarks
     * The player parameter can be either an string or a player object, being a player object when the target player to be banned is online.
     */
    public unbanPlayer(player: Player | string) {
        this.BAN_OBJECTIVE?.setScore(this.formatBanName(player), 0);
    }

    public constructor() {
        this.setupBanSystem();
        this.startBanProtocol();
        CommandManager.registerCommand(new UnbanCommand());
        CommandManager.registerCommand(new BanCommand());
    }

    private startBanProtocol() {
        try {
            world.afterEvents.playerSpawn.subscribe((arg) => {
                const { player } = arg;
                
                if (
                    !this.BAN_OBJECTIVE.hasParticipant(
                        this.formatBanName(player),
                    )
                ) {
                    return;
                }

                if (!this.isBanned(player) || !this.isEnabled()) {
                    return;
                }

                player.removeTag("inCinematic");
                player.runCommand(`kick "${player.name}"`);
            });
        } catch (error) {
            this.logger().error(error);
        }
    }
}
