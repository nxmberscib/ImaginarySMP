import { Player } from "@minecraft/server";
import CommandAlias from "teseract/api/command/CommandAlias";
import CommandManager from "teseract/api/command/CommandManager";
import Default from "teseract/api/command/Default";

@CommandAlias("help")
export default class HelpCommand {
    public constructor() {
        CommandManager.registerCommand(this)
    }
    
    @Default
    onDefault(player: Player) {
        player.sendMessage("Has recibido ayuda.")
    }
}