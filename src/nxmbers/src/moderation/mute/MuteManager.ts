import { ChatSendBeforeEvent, Player, world } from "@minecraft/server";
import GlobalMuteInformation from "./GlobalMuteInformation";
import MuteInformation from "./MuteInformation";
import FormatUtils from "teseract/api/util/FormatUtils";
import TimerUtils from "teseract/api/util/TimerUtils";
import CommandManager from "teseract/api/command/CommandManager";
import Imaginary from "nxmbers/src/Imaginary";
import Logger from "teseract/api/Logger";
import Runnable from "teseract/api/util/Runnable";
import MuteCommand from "./command/MuteCommand";
import UnmuteCommand from "./command/UnmuteCommand";
import Mixin from "teseract/api/util/Mixin";
import WithLogger from "nxmbers/src/util/WithLogger";

const $c = "§c";
const $f = "§f";
const $b = "§l";
const $r = "§r";
const $7 = "§7";

export default class Moderation extends Mixin(Runnable, WithLogger) {
    public readonly MUTE_INFORMATION: string =
        "muteInfo" + (212244).toString(16);

    private getPlayerWithID(muted: string) {
        const players = world.getPlayers({ name: muted })?.[0];
        return players;
    }

    public readonly MUTED_MESSAGE: string =
        `${$b}${$c}|||||||||||||${$b} ¡ESTÁS MUTEADO!  \n` +
        `${$b}${$c}|||||${$f}|||${$c}|||||\n` +
        `${$b}${$c}|||||${$f}|||${$c}|||||` +
        `${$r}${$7} > Restante: %1%\n` +
        `${$b}${$c}|||||${$f}|||${$c}|||||\n` +
        `${$b}${$c}|||||${$f}|||${$c}|||||` +
        `${$r}${$7} > Razón: %2% \n` +
        `${$b}${$c}|||||||||||||\n` +
        `${$b}${$c}|||||${$f}|||${$c}|||||` +
        `${$r}${$7} > Staff: %3% \n` +
        `${$b}${$c}|||||||||||||\n`;

    public save(info: GlobalMuteInformation) {
        world.setDynamicProperty(this.MUTE_INFORMATION, JSON.stringify(info));
    }

    public savePlayer(information: MuteInformation) {
        const info = this.getMuteInformation() ?? {};
        info[information.mutedId] = information;
        this.save(info as GlobalMuteInformation);
    }

    public getLastTimeChecked() {
        return this.getMuteInformation().lastTimeChecked;
    }

    public setLastTimeChecked(millis: number) {
        const info = this.getMuteInformation();
        info.lastTimeChecked = millis;
        this.save(info as GlobalMuteInformation);
    }

    public getMuteInformation(): GlobalMuteInformation;
    public getMuteInformation(player?: Player): MuteInformation;
    public getMuteInformation(player?: string): MuteInformation;
    public getMuteInformation(
        arg1?: Player | string,
    ): GlobalMuteInformation | MuteInformation {
        let str = world.getDynamicProperty(this.MUTE_INFORMATION) as string;
        if (!str) {
            str = "{}";
            world.setDynamicProperty(this.MUTE_INFORMATION, "{}");
        }
        let muteInfo = JSON.parse(str ?? "{}");

        if (!arg1) {
            return muteInfo ?? undefined;
        }

        return muteInfo[arg1 instanceof Player ? arg1.id : arg1] ?? undefined;
    }

    public mutePlayer(
        player: Player,
        duration: number,
        staff?: Player,
        reason?: string,
    ): void;
    public mutePlayer(
        player: string,
        duration: number,
        staff?: Player,
        reason?: string,
    ): void;
    public mutePlayer(
        player: Player | string,
        duration: number = Infinity,
        staff?: Player,
        reason?: string,
    ): void {
        const info = this.getMuteInformation() ?? {};

        const muteInfo = {
            shouldEndTimestamp: Date.now() + duration * 1000,
            startTimestamp: Date.now(),
            mutedId: player instanceof Player ? player.id : player,
            staff: !staff
                ? undefined
                : {
                      uuid: staff.id,
                      displayName: staff.nameTag,
                      name: staff.name,
                  },
            reason: reason ?? "No especificada",
        };

        info[player instanceof Player ? player.id : player] = muteInfo;

        Imaginary.LOGGER.info(
            "[moderation] Player muted: " +
                JSON.stringify(
                    info[player instanceof Player ? player.id : player],
                ),
        );

        this.save(info as GlobalMuteInformation);

        if (player instanceof Player)
            player.sendMessage(
                FormatUtils.placeHolder(
                    this.MUTED_MESSAGE,
                    TimerUtils.parseTime(
                        Math.floor(
                            (muteInfo.shouldEndTimestamp - Date.now()) / 1000,
                        ),
                    ),
                    muteInfo.reason,
                    muteInfo.staff?.name ?? "Consola",
                ),
            );
    }

    public unmutePlayer(player: Player): void;
    public unmutePlayer(player: string): void;
    public unmutePlayer(player: Player | string): void {
        const info = this.getMuteInformation();

        if (!info) {
            return;
        }

        Imaginary.LOGGER.info(
            "[moderation] Player unmuted: " +
                JSON.stringify(
                    info[player instanceof Player ? player.id : player],
                ),
        );

        delete info[player instanceof Player ? player.id : player];

        this.save(info as GlobalMuteInformation);
    }

    public isMuted(player: Player | string) {
        if (!this.getMuteInformation(player as any)) {
            return false;
        }
        return (
            Date.now() <
            (this.getMuteInformation(player as any).shouldEndTimestamp ??
                Infinity)
        );
    }

    public constructor() {
        super();

        world.beforeEvents.chatSend.subscribe(this.onChatSend.bind(this));

        CommandManager.registerCommand(new MuteCommand());
        CommandManager.registerCommand(new UnmuteCommand());

        for (const [muted] of Object.entries(this.getMuteInformation() ?? {})) {
            if (muted == "lastTimeChecked") {
                continue;
            }

            const info = this.getMuteInformation(muted);
            Imaginary.LOGGER.debug(info);
            if (!info) {
                continue;
            }
            info.shouldEndTimestamp += Date.now() - this.getLastTimeChecked();

            this.savePlayer(info);
        }

        this.setLastTimeChecked(Date.now());

        this.runTimer(20);
        Imaginary.LOGGER.info("Mute Manager loaded and running");
    }

    public async onChatSend(event: ChatSendBeforeEvent) {
        const message = event.message;
        const player = event.sender;

        if (message.startsWith(CommandManager.prefix)) {
            return;
        }

        if (!this.isMuted(player)) {
            return;
        }

        event.cancel = true;
        await null;
        const info = this.getMuteInformation(player);

        player.sendMessage(
            FormatUtils.placeHolder(
                this.MUTED_MESSAGE,
                TimerUtils.parseTime(
                    Math.floor((info.shouldEndTimestamp - Date.now()) / 1000),
                ),
                info.reason,
                info.staff?.name ?? "Consola",
            ),
        );
    }

    public override *onRunJob(): Generator<void, void, void> {
        if (!this.getMuteInformation()) {
            return;
        }

        for (const [muted] of Object.entries(this.getMuteInformation())) {
            if (muted == "lastTimeChecked") {
                continue;
            }

            if (this.isMuted(muted)) {
                continue;
            }

            this.unmutePlayer(muted);
            const online = this.getPlayerWithID(muted);

            if (online) {
                online.sendMessage("Tas desmutiao niggywiggy");
            }

            yield;
        }

        this.setLastTimeChecked(Date.now());
    }
}
