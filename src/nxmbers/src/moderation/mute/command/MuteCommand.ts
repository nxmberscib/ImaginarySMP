import { ChatSendBeforeEvent, Player, system, world } from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";
import WithLogger from "nxmbers/src/util/WithLogger";
import CommandAlias from "teseract/api/command/CommandAlias";
import CommandManager from "teseract/api/command/CommandManager";
import Default from "teseract/api/command/Default";
import Optional from "teseract/api/command/Optional";
import Permission from "teseract/api/command/Permission";
import TimerUtils from "teseract/api/util/TimerUtils";

@CommandAlias("mute")
@Permission((p) => p.hasTag("admin") || p.isOp())
export default class MuteCommand extends WithLogger {
    constructor() {
        super();
        CommandManager.registerCommand(this);
        this.logger().robust("Mute command loaded");
    }

    @Default
    public onMute(player: Player, target: Player, @Optional duration: string) {
        // target.setDynamicProperty("imaginary:muted_by", player.name);

        if (!duration) {
            player.sendMessage(
                `§7${target.name} ha silenciado permanentemente.`,
            );

            Imaginary.getMuteManager().mutePlayer(
                target,
                Infinity,
                undefined,
                player.name,
            );
        } else {
            const parsedDuration = TimerUtils.dateToSeconds(duration);

            player.sendMessage(
                `§7${target.name} ha sido silenciado por ${TimerUtils.parseDate(
                    parsedDuration,
                )}.`,
            );

            Imaginary.getMuteManager().mutePlayer(target, parsedDuration);
        }
    }

    @Default
    public onMuteReason(
        player: Player,
        target: Player,
        duration: string,
        reason: string,
    ) {
        // target.setDynamicProperty("imaginary:muted_by", player.name);
        // target.setDynamicProperty("imaginary:muted_reason", reason);

        if (!duration) {
            player.sendMessage(
                `§7${target.name} ha sido silenciado permanentemente.`,
            );

            Imaginary.getMuteManager().mutePlayer(
                target,
                Infinity,
                player,
                reason,
            );
        } else {
            const parsedDuration = TimerUtils.dateToSeconds(duration);

            Imaginary.getMuteManager().mutePlayer(
                target,
                parsedDuration,
                player,
                reason,
            );

            player.sendMessage(
                `§7${target.name} ha sido silenciado por ${TimerUtils.parseDate(
                    parsedDuration,
                )}.`,
            );
        }
    }
}
