import { ChatSendBeforeEvent, Player, system, world } from "@minecraft/server";
import CommandAlias from "teseract/api/command/CommandAlias";
import CommandManager from "teseract/api/command/CommandManager";
import Default from "teseract/api/command/Default";
import Optional from "teseract/api/command/Optional";
import TimerUtils from "teseract/api/util/TimerUtils";

@CommandAlias("mute")
export default class MuteCommand {
    constructor() {
        CommandManager.registerCommand(this);
        world.beforeEvents.chatSend.subscribe(this.onChatAttempt);
        system.runInterval(() => system.runJob(this.onRunJob()), 20);
    }

    public *onRunJob(...args: any[]): Generator<void, void, void> {
        for (const player of world.getPlayers()) {
            const remainingMute = player.getDynamicProperty(
                "imaginary:muted",
            ) as number;
            if (
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

    onChatAttempt(event: ChatSendBeforeEvent) {
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
        const reason = player.getDynamicProperty("imaginary:muted_reason");

        player.sendMessage(
            `\n§l§c¡ESTÁS SILENCIADO!§r\n\n§7> §cTiempo Restante: §7${
                remainingMute == -1
                    ? "Sanción permanente."
                    : TimerUtils.parseTime(remainingMute)
            }\n§7> §cSancionado Por:§7${staff}\n§7> §cRazón: §7${reason}\n\n`,
        );
        event.cancel = true;
    }

    @Default
    mute(player: Player, target: Player, @Optional duration: string) {
        if (!duration) {
            player.sendMessage(
                `§7${target.name} ha silenciado permanentemente.`,
            );
            player.setDynamicProperty("imaginary:muted", -1);
        } else {
            const parsedDuration = TimerUtils.dateToSeconds(duration);
            player.setDynamicProperty("imaginary:muted", parsedDuration);
            player.sendMessage(
                `§7${target.name} ha sido silenciado por ${TimerUtils.parseDate(
                    parsedDuration,
                )}.`,
            );
        }
        target.setDynamicProperty("imaginary:muted_by", player.name);
    }

    @Default
    muteReason(
        player: Player,
        target: Player,
        duration: string,
        reason: string,
    ) {
        if (!duration) {
            player.sendMessage(
                `§7${target.name} ha sido silenciado permanentemente.`,
            );
            player.setDynamicProperty("imaginary:muted", -1);
        } else {
            const parsedDuration = TimerUtils.dateToSeconds(duration);
            player.setDynamicProperty("imaginary:muted", parsedDuration);
            player.sendMessage(
                `§7${target.name} ha sido silenciado por ${TimerUtils.parseDate(
                    parsedDuration,
                )}.`,
            );
        }
        target.setDynamicProperty("imaginary:muted_by", player.name);
        target.setDynamicProperty("imaginary:muted_reason", reason);
    }
}
