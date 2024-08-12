import CommandManager from "teseract/api/command/CommandManager";
import HelpCommand from "./user/Help";

export default class ImaginaryCommands {
    public static registerCommands(): void {
        // CommandManager.registerCommand(new MuteCommand());
        // CommandManager.registerCommand(new UnbanCommand());
        // CommandManager.registerCommand(new BanCommand());
        // CommandManager.registerCommand(new UnmuteCommand());

        CommandManager.registerCommand(new HelpCommand());
    }
}
