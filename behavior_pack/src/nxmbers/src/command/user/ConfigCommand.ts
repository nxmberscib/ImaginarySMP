import { Player } from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";
import CommandAlias from "teseract/api/command/CommandAlias";
import Default from "teseract/api/command/Default";

@CommandAlias("config")
export default class ConfigCommand {
    @Default
    private onDefault(sender: Player) {
        Imaginary.getFastTotemManager().showConfigMenu(sender);
        sender.sendMessage({ translate: "ui.config_menu.close_chat" });
    }
}
