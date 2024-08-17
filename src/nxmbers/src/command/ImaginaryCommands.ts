import CommandManager from "teseract/api/command/CommandManager";
import HelpCommand from "./user/Help";
import WithLogger from "../util/WithLogger";
import Imaginary from "../Imaginary";

export default class ImaginaryCommands extends WithLogger {
    public static registerCommands(): void {
        CommandManager.registerCommand(new HelpCommand());

        Imaginary.LOGGER.info("Imaginary commands loaded");
    }
}
