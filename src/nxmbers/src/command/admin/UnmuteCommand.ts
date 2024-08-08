import { world, system, ChatSendBeforeEvent, Player } from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";
import CommandAlias from "teseract/api/command/CommandAlias";
import CommandManager from "teseract/api/command/CommandManager";
import Default from "teseract/api/command/Default";
import Optional from "teseract/api/command/Optional";
import TimerUtils from "teseract/api/util/TimerUtils";

@CommandAlias("unmute")
export default class UnmuteCommand {
    constructor() {
        CommandManager.registerCommand(this);
    }

    @Default
    mute(player: Player, target: Player) {
        const remainingMute = target.getDynamicProperty(
            "imaginary:muted",
        ) as number;

        if (remainingMute <= 0 && remainingMute != -1) {
            player.sendMessage(`§7${target.name} no está silenciado.`);
            return;
        }

        Imaginary.getInstance().getMuteManager().unmutePlayer(target);

        player.sendMessage(`§7${target.name} ya no está silenciado.`);
    }
}
