import { Player } from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";
import WithLogger from "nxmbers/src/util/WithLogger";
import CommandAlias from "teseract/api/command/CommandAlias";
import CommandManager from "teseract/api/command/CommandManager";
import Default from "teseract/api/command/Default";
import Permission from "teseract/api/command/Permission";

@CommandAlias("unmute")
@Permission((p) => p.hasTag("admin") || p.isOp())
export default class UnmuteCommand extends WithLogger {
    public constructor() {
        super();
        CommandManager.registerCommand(this);
        Imaginary.LOGGER.robust("Unmute command loaded");
    }

    @Default
    public onUnmute(player: Player, target: Player) {
        const remainingMute = target.getDynamicProperty(
            "imaginary:muted",
        ) as number;

        if (remainingMute <= 0 && remainingMute != -1) {
            player.sendMessage({
                translate: "command.mute.not_muted",
                with: [target.name],
            });
            return;
        }

        Imaginary.getMuteManager().unmutePlayer(target);
        
        player.sendMessage({
            translate: "command.mute.success",
            with: [target.name],
        });
    }
}
