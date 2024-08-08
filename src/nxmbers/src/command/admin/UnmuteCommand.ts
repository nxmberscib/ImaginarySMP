import { world, system, ChatSendBeforeEvent, Player } from "@minecraft/server";
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
        
        const staff = target.getDynamicProperty("imaginary:muted_by");
        const reason = target.getDynamicProperty("imaginary:muted_reason");
        
        target.sendMessage(
            `\n§l§c¡YA NO ESTÁS SILENCIADO!§r\n\n§7> §cSancionado Por: §7${staff}\n§7> §cRazón: §7${reason}\n\n§o§cAsegurate de cumplir los lineamientos del servidor para evitar ser sancionado nuevamente.\n\n`,
        );

        player.sendMessage(`§7${target.name} ha sido desilenciado.`);
        player.setDynamicProperty("imaginary:muted", 0);
    }
}
