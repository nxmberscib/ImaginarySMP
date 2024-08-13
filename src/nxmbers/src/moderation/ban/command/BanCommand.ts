import { Player } from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";
import WithLogger from "nxmbers/src/util/WithLogger";
import CommandAlias from "teseract/api/command/CommandAlias";
import Default from "teseract/api/command/Default";

@CommandAlias("ban|unpardon")
export default class BanCommand extends WithLogger {
    @Default
    async onDefaultString(player: Player, unbannedName: string) {
        const banManager = Imaginary.getBanManager();
        const unbanned = unbannedName.replace(/\"+/g, '');
        await null
        banManager.banPlayer(unbanned);
        player.sendMessage(`'${unbanned}' fue baneado.`);
    }
    
    @Default
    async onDefault(player: Player, unbanned: Player) {
        const banManager = Imaginary.getBanManager();
        await null
        banManager.banPlayer(unbanned);
        player.sendMessage(`${unbanned.name} fue baneado.`);
    }
}
