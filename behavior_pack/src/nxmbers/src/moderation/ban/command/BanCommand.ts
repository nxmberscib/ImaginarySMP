import { Player } from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";
import CommandAlias from "teseract/api/command/CommandAlias";
import CommandManager from "teseract/api/command/CommandManager";
import Default from "teseract/api/command/Default";
import Optional from "teseract/api/command/Optional";
import Permission from "teseract/api/command/Permission";
import TimerUtils from "teseract/api/util/TimerUtils";

@CommandAlias("ban|unpardon")
@Permission((p) => p.hasTag("admin") || p.isOp())
export default class BanCommand {
    public constructor() {
        CommandManager.registerCommand(this);
        Imaginary.LOGGER.robust("Ban command loaded");
    }

    @Default
    public onBan(player: Player, target: Player, @Optional duration: string) {
        if (!duration) {
            player.sendMessage({
                translate: "command.ban.success",
                with: [target.name],
            });

            Imaginary.getBanManager().banPlayer(target, Infinity, undefined, player.name);
        } else {
            const parsedDuration = TimerUtils.dateToSeconds(duration);

            player.sendMessage({
                translate: "command.ban.success_duration",
                with: [target.name, TimerUtils.parseDate(parsedDuration)],
            });

            Imaginary.getBanManager().banPlayer(target, parsedDuration, undefined, player.name);
        }
    }

    @Default
    public onBanReason(player: Player, target: Player, duration: string, reason: string) {
        if (!duration) {
            player.sendMessage({
                translate: "command.ban.success",
                with: [target.name],
            });

            Imaginary.getBanManager().banPlayer(target, Infinity, player, reason);
        } else {
            const parsedDuration = TimerUtils.dateToSeconds(duration);

            Imaginary.getBanManager().banPlayer(target, parsedDuration, player, reason);

            player.sendMessage({
                translate: "command.ban.success_duration",
                with: [target.name, TimerUtils.parseDate(parsedDuration), reason],
            });
        }
    }
}
