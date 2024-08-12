import { Player } from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";
import CommandAlias from "teseract/api/command/CommandAlias";
import Default from "teseract/api/command/Default";

@CommandAlias("ban|unpardon")
export default class BanCommand {
    @Default
    async onDefaultString(player: Player, unbannedName: string) {
        const banManager = Imaginary.getInstance().getBanManager();
        const unbanned = unbannedName.replace(/\"+/g, '');
        await null
        banManager.banPlayer(unbanned);
        player.sendMessage(`'${unbanned}' fue baneado.`);
    }
    
    @Default
    async onDefault(player: Player, unbanned: Player) {
        const banManager = Imaginary.getInstance().getBanManager();
        await null
        banManager.banPlayer(unbanned);
        player.sendMessage(`${unbanned.name} fue baneado.`);
    }
}
