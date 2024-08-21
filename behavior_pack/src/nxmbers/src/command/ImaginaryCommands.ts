import CommandManager from "teseract/api/command/CommandManager";
import HelpCommand from "./user/Help";
import WithLogger from "../util/WithLogger";
import Imaginary from "../Imaginary";
import ConfigCommand from "./user/ConfigCommand";

export default class ImaginaryCommands extends WithLogger {
    public static registerCommands(): void {
        CommandManager.registerCommand(new HelpCommand());
        CommandManager.registerCommand(new ConfigCommand());

        Imaginary.LOGGER.info("Imaginary commands loaded");
    }
}
