import CommandManager from "teseract/api/command/CommandManager";
import MuteCommand from "./admin/MuteCommand";
import UnmuteCommand from "./admin/UnmuteCommand";
import HelpCommand from "./user/Help";
import UnbanCommand from "./admin/UnbanCommand";

export default class ImaginaryCommands {
    public static registerCommands(): void {
        CommandManager.registerCommand(new MuteCommand());
        CommandManager.registerCommand(new UnbanCommand());
        CommandManager.registerCommand(new UnmuteCommand());

        CommandManager.registerCommand(new HelpCommand());
    }
}
