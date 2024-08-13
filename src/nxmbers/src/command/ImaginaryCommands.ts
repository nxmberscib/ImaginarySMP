import CommandManager from "teseract/api/command/CommandManager";
import HelpCommand from "./user/Help";
import WithLogger from "../util/WithLogger";

export default class ImaginaryCommands extends WithLogger {
    public static registerCommands(): void {
        CommandManager.registerCommand(new HelpCommand());

        this.logger().info("Imaginary commands loaded");
    }
}
