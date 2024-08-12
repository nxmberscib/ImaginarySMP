import { Player } from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";
import WithLogger from "nxmbers/src/util/WithLogger";
import CommandAlias from "teseract/api/command/CommandAlias";
import Default from "teseract/api/command/Default";

@CommandAlias("unban|pardon")
export default class UnbanCommand extends WithLogger {
    @Default
    async onDefaultString(player: Player, unbannedName: string) {
        const banManager = Imaginary.getInstance().getBanManager();
        const unbanned = unbannedName.replace(/\"+/g, "");
        await null;
        banManager.unbanPlayer(unbanned);
        player.sendMessage(`'${unbanned}' fue desbaneado.`);
    }

    @Default
    async onDefault(player: Player, unbanned: Player) {
        const banManager = Imaginary.getInstance().getBanManager();
        await null;
        banManager.unbanPlayer(unbanned);
        player.sendMessage(`${unbanned.name} fue desbaneado.`);
    }
}
