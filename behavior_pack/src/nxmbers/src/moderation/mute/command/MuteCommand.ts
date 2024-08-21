import { Player } from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";
import CommandAlias from "teseract/api/command/CommandAlias";
import CommandManager from "teseract/api/command/CommandManager";
import Default from "teseract/api/command/Default";
import Optional from "teseract/api/command/Optional";
import Permission from "teseract/api/command/Permission";
import TimerUtils from "teseract/api/util/TimerUtils";

@CommandAlias("mute")
@Permission((p) => p.hasTag("admin") || p.isOp())
export default class MuteCommand {
    public constructor() {
        CommandManager.registerCommand(this);
        Imaginary.LOGGER.robust("Mute command loaded");
    }

    @Default
    public onMute(player: Player, target: Player, @Optional duration: string) {
        if (!duration) {
            player.sendMessage({
                translate: "command.mute.success",
                with: [target.name],
            });

            Imaginary.getMuteManager().mutePlayer(
                target,
                Infinity,
                undefined,
                player.name,
            );
        } else {
            const parsedDuration = TimerUtils.dateToSeconds(duration);

            player.sendMessage({
                translate: "command.mute.success_duration",
                with: [target.name, TimerUtils.parseDate(parsedDuration)],
            });

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
        if (!duration) {
            player.sendMessage({
                translate: "command.mute.success",
                with: [target.name],
            });

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

            player.sendMessage({
                translate: "command.mute.success_duration",
                with: [
                    target.name,
                    TimerUtils.parseDate(parsedDuration),
                    reason,
                ],
            });
        }
    }
}
