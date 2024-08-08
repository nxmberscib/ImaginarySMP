// @ts-check

import {
    ScoreboardObjective,
    world,
    Player,
    system,
    ChatSendBeforeEvent,
} from "@minecraft/server";
import CommandManager from "teseract/api/command/CommandManager";
import TimerUtils from "teseract/api/util/TimerUtils";

export default class MuteManager {
    /**
     * @remarks
     * Mute protocol identifier
     */
    MUTE_PROTOCOL_ID = "imaginary:mute_protocol";
    /**
     * @remarks
     * Mute objective identifier
     */
    MUTE_OBJECTIVE_ID = "imaginary:muted";
    /**
     * @remarks
     * Mute objective object
     */
    MUTE_OBJECTIVE: ScoreboardObjective;

    public toggleMuteProtocol() {
        const on = world.getDynamicProperty(this.MUTE_PROTOCOL_ID);
        world.setDynamicProperty(
            this.MUTE_PROTOCOL_ID,
            !(on === undefined ? false : on),
        );
    }

    public isMuteProtocolEnabled(): boolean {
        const on = world.getDynamicProperty(this.MUTE_PROTOCOL_ID) as boolean;
        return on;
    }

    /**
     *
     * @param  player
     */
    public formatMuteName(player: Player | string) {
        return player instanceof Player ? `{${player.name}}` : `{${player}}`;
    }

    /**
     *
     * @param  player
     */
    public mutePlayer(
        player: Player | string,
        muteTime = Infinity,
        reason?: string,
        mutedBy?: string,
    ) {
        this.MUTE_OBJECTIVE?.setScore(this.formatMuteName(player), 1);

        if (!(player instanceof Player) || !player.isValid()) {
            return;
        }

        player.setDynamicProperty(
            "imaginary:muted_timestamp",
            Date.now() + muteTime * 20 * 1000,
        );
        player.setDynamicProperty("imaginary:muted_by", reason);
        player.setDynamicProperty("imaginary:muted_reason", mutedBy);

        player.sendMessage(
            `\n§l§c¡ESTÁS SILENCIADO!§r\n\n§7> §cTiempo Restante: §7${
                muteTime == -1 || muteTime === Infinity
                    ? "Sanción permanente."
                    : TimerUtils.parseTime(muteTime)
            }\n§7> §cSancionado Por:§7${mutedBy}\n§7> §cRazón: §7${reason}\n\n`,
        );
    }

    /**
     *
     */
    public isMuted(player: Player | string) {
        const isMuted = this.MUTE_OBJECTIVE.getScore(
            this.formatMuteName(player),
        );

        return !isMuted ? false : true;
    }

    /**
     * Unmutes a player.
     * @remarks
     * The player parameter can be either an string or a player object, being a player object when the target player to be muted is online.
     */
    public unmutePlayer(player: Player) {
        const staff = player.getDynamicProperty("imaginary:muted_by");
        const reason = player.getDynamicProperty("imaginary:muted_reason");

        player.sendMessage(
            `\n§l§c¡YA NO ESTÁS SILENCIADO!§r\n\n§7> §cSancionado Por: §7${
                staff ?? "No especificado."
            }\n§7> §cRazón: §7${
                reason ?? "No especificada."
            }\n\n§o§cAsegurate de cumplir los lineamientos del servidor para evitar ser sancionado nuevamente.\n\n`,
        );

        player.setDynamicProperty("imaginary:muted", 0);
    }

    *#onRunJob(...args: any[]): Generator<void, void, void> {
        for (const player of world.getPlayers()) {
            const remainingMute = player.getDynamicProperty(
                "imaginary:muted",
            ) as number;
            const timestamp = player.getDynamicProperty(
                "imaginary:muted_timestamp",
            ) as number;

            if (
                Date.now() < timestamp ||
                remainingMute == undefined ||
                remainingMute == 0 ||
                remainingMute == -1
            ) {
                continue;
            }

            player.setDynamicProperty("imaginary:muted", remainingMute - 1);

            if (remainingMute - 1 == 0) {
                const staff = player.getDynamicProperty("imaginary:muted_by");
                const reason = player.getDynamicProperty(
                    "imaginary:muted_reason",
                );
                player.sendMessage(
                    `\n§l§c¡YA NO ESTÁS SILENCIADO!§r\n\n§7> §cSancionado Por: §7${staff}\n§7> §cRazón: §7${reason}\n\n§o§cAsegurate de cumplir los lineamientos del servidor para evitar ser sancionado nuevamente.\n\n`,
                );
            }

            yield;
        }
    }

    public startMuteProtocol() {
        try {
            system.runInterval(() => system.runJob(this.#onRunJob()), 20);

            world.beforeEvents.chatSend.subscribe(function onChatAttempt(
                event: ChatSendBeforeEvent,
            ) {
                const { sender: player } = event;
                if (event.message.startsWith(CommandManager.prefix)) {
                    return;
                }
                const remainingMute = player.getDynamicProperty(
                    "imaginary:muted",
                ) as number;

                if (remainingMute <= 0 && remainingMute != -1) {
                    return;
                }
                const staff = player.getDynamicProperty("imaginary:muted_by");
                const reason = player.getDynamicProperty(
                    "imaginary:muted_reason",
                );

                player.sendMessage(
                    `\n§l§c¡ESTÁS SILENCIADO!§r\n\n§7> §cTiempo Restante: §7${
                        remainingMute == -1
                            ? "Sanción permanente."
                            : TimerUtils.parseTime(remainingMute)
                    }\n§7> §cSancionado Por:§7${staff}\n§7> §cRazón: §7${reason}\n\n`,
                );
                event.cancel = true;
            });
        } catch (error) {
            console.warn(error, error.stack);
        }
    }
}
