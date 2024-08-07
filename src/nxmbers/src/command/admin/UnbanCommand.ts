import { Player } from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";
import CommandAlias from "teseract/api/command/CommandAlias";
import Default from "teseract/api/command/Default";

@CommandAlias("unban|pardon")
export default class UnbanCommand {
    @Default
    onDefaultString(player: Player, unbanned: string) {
        const banManager = Imaginary.getInstance().getBanManager();
        banManager.unbanPlayer(unbanned);
        player.sendMessage(`${unbanned} fue desbaneado.`);
    }
    
    @Default
    onDefault(player: Player, unbanned: Player) {
        const banManager = Imaginary.getInstance().getBanManager();
        banManager.unbanPlayer(unbanned);
        player.sendMessage(`${unbanned.name} fue desbaneado.`);
    }
}
