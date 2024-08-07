// @ts-check

import { ScoreboardObjective, world, Player } from "@minecraft/server";

export default class BanManager {
    /**
     * @remarks
     * Ban protocol identifier
     */
    BAN_PROTOCOL_ID = "imaginary:ban_protocol";
    /**
     * @remarks
     * Ban objective identifier
     */
    BAN_OBJECTIVE_ID = "imaginary:banned";
    /**
     * @remarks
     * Ban objective object
     */
    BAN_OBJECTIVE: ScoreboardObjective;

    public toggleBanProtocol() {
        const on = world.getDynamicProperty(this.BAN_PROTOCOL_ID);
        world.setDynamicProperty(
            this.BAN_PROTOCOL_ID,
            !(on === undefined ? false : on),
        );
    }

    public isBanProtocolEnabled() {
        const on = world.getDynamicProperty(this.BAN_OBJECTIVE_ID);
        return on === undefined ? false : on;
    }

    /**
     *
     * @param {Player | string} player
     */
    public formatBanName(player: Player | string) {
        return player instanceof Player ? `{${player.name}}` : `{${player}}`;
    }

    public setupBanSystem() {
        const objective = world.scoreboard.getObjective(this.BAN_OBJECTIVE_ID);

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
     * @param {Player | string} player
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

    public startBanProtocol() {
        world.afterEvents.playerSpawn.subscribe((arg) => {
            const { player } = arg;

            if (!this.isBanned(player) || !this.isBanProtocolEnabled()) {
                return;
            }

            player.removeTag("inCinematic");
            player.runCommand(`kick "${player.name}"`);
        });
    }
}
