import "reflect-metadata";
import * as MinecraftServer from "@minecraft/server";
import CommandHandler from "teseract/api/command/CommandHandler";

export default new (class CommandManager {
    #commands: InstanceType<any>[] = [];

    public get prefix(): string {
        let prefix = MinecraftServer.world.getDynamicProperty(
            "teseract:command_prefix",
        ) as string;
        if (prefix == undefined) {
            prefix = "-";
        }
        return prefix;
    }

    public onCommandSent(event: MinecraftServer.ChatSendBeforeEvent) {
        if (!event.message.startsWith(this.prefix)) {
            return;
        }

        event.cancel = true;

        let regex = /(@[aepsr]\[|@"[^"]*"|"[^"]*"|\[[^\]]*\]|\S+)/g;
        
        const [command, ...parameters] = event.message.match(regex);
        const processedParameters = parameters.map((param) => {
            if (param.startsWith('"') && param.endsWith('"')) {
                return param.slice(1, -1);
            }
            return param;
        });

        try {
            CommandHandler(
                event.sender,
                command.substring(this.prefix.length),
                ...processedParameters,
            );
        } catch (error) {
            console.error(error, error.stack);
        }
    }

    public constructor() {
        MinecraftServer.world.beforeEvents.chatSend.subscribe((ev) =>
            this.onCommandSent(ev),
        );
    }

    public getCommands() {
        return this.#commands;
    }

    public registerCommand(commandClass: InstanceType<any>) {
        this.#commands.push(commandClass);
    }
})();
