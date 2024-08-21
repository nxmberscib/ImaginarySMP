import { Player } from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";
import CommandAlias from "teseract/api/command/CommandAlias";
import Default from "teseract/api/command/Default";
import Permission from "teseract/api/command/Permission";

@CommandAlias("unban|pardon")
@Permission((p) => p.hasTag("admin") || p.isOp())
export default class UnbanCommand {
    @Default
    async onDefaultString(player: Player, unbannedName: string) {
        const banManager = Imaginary.getBanManager();
        const unbanned = unbannedName.replace(/\"+/g, "");
        await null;
        banManager.unbanPlayer(unbanned);
        player.sendMessage(`'${unbanned}' fue desbaneado.`);
    }

    @Default
    async onDefault(player: Player, unbanned: Player) {
        const banManager = Imaginary.getBanManager();
        await null;
        banManager.unbanPlayer(unbanned);
        player.sendMessage(`${unbanned.name} fue desbaneado.`);
    }
}
