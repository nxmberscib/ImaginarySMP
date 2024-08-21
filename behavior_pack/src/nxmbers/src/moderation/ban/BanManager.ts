import { Player, world } from "@minecraft/server";
import GlobalBanInformation from "./GlobalBanInformation";
import BanInformation from "./BanInformation";
import FormatUtils from "teseract/api/util/FormatUtils";
import TimerUtils from "teseract/api/util/TimerUtils";
import CommandManager from "teseract/api/command/CommandManager";
import Imaginary from "nxmbers/src/Imaginary";
import Runnable from "teseract/api/util/Runnable";
import BanCommand from "./command/BanCommand";
import UnbanCommand from "./command/UnbanCommand";

const $c = "§c";
const $f = "§f";
const $b = "§l";
const $r = "§r";
const $7 = "§7";

export default class BanManager extends Runnable {
    public readonly BAN_INFORMATION: string = "banInfo" + (212244).toString(16);

    private getPlayerWithID(banned: string) {
        const players = world.getPlayers({ name: banned })?.[0];
        return players;
    }

    public readonly BANNED_MESSAGE: string =
        `${$b}${$c}|||||||||||||${$b} ¡ESTÁS BANEADO!  \n` +
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

    public save(info: GlobalBanInformation) {
        world.setDynamicProperty(this.BAN_INFORMATION, JSON.stringify(info));
    }

    public savePlayer(information: BanInformation) {
        const info = this.getBanInformation() ?? {};
        info[information.bannedId] = information;
        this.save(info as GlobalBanInformation);
    }

    public getLastTimeChecked() {
        return this.getBanInformation().lastTimeChecked;
    }

    public setLastTimeChecked(millis: number) {
        const info = this.getBanInformation();
        info.lastTimeChecked = millis;
        this.save(info as GlobalBanInformation);
    }

    public getBanInformation(): GlobalBanInformation;
    public getBanInformation(player?: Player): BanInformation;
    public getBanInformation(player?: string): BanInformation;
    public getBanInformation(
        arg1?: Player | string,
    ): GlobalBanInformation | BanInformation {
        let str = world.getDynamicProperty(this.BAN_INFORMATION) as string;
        if (!str) {
            str = "{}";
            world.setDynamicProperty(this.BAN_INFORMATION, "{}");
        }
        let banInfo = JSON.parse(str ?? "{}");

        if (!arg1) {
            return banInfo ?? undefined;
        }

        return banInfo[arg1 instanceof Player ? arg1.id : arg1] ?? undefined;
    }

    public banPlayer(
        player: Player,
        duration: number,
        staff?: Player,
        reason?: string,
    ): void;
    public banPlayer(
        player: string,
        duration: number,
        staff?: Player,
        reason?: string,
    ): void;
    public banPlayer(
        player: Player | string,
        duration: number = Infinity,
        staff?: Player,
        reason?: string,
    ): void {
        const info = this.getBanInformation() ?? {};

        const banInfo = {
            shouldEndTimestamp: Date.now() + duration * 1000,
            startTimestamp: Date.now(),
            bannedId: player instanceof Player ? player.id : player,
            staff: !staff
                ? undefined
                : {
                      uuid: staff.id,
                      displayName: staff.nameTag,
                      name: staff.name,
                  },
            reason: reason ?? "No especificada",
        };

        info[player instanceof Player ? player.id : player] = banInfo;

        Imaginary.LOGGER.info(
            "[moderation] Player banned: " +
                JSON.stringify(
                    info[player instanceof Player ? player.id : player],
                ),
        );

        this.save(info as GlobalBanInformation);

        if (player instanceof Player) {
            player.runCommand(
                `kick "${player.name}" "${FormatUtils.placeHolder(
                    this.BANNED_MESSAGE,
                    TimerUtils.parseTime(
                        Math.floor(
                            (banInfo.shouldEndTimestamp - Date.now()) / 1000,
                        ),
                    ),
                    banInfo.reason,
                    banInfo.staff?.name ?? "Consola",
                )}"`,
            );
        }
    }

    public unbanPlayer(player: Player): void;
    public unbanPlayer(player: string): void;
    public unbanPlayer(player: Player | string): void {
        const info = this.getBanInformation();

        if (!info) {
            return;
        }

        Imaginary.LOGGER.info(
            "[moderation] Player unbanned: " +
                JSON.stringify(
                    info[player instanceof Player ? player.id : player],
                ),
        );

        delete info[player instanceof Player ? player.id : player];

        this.save(info as GlobalBanInformation);
    }

    public isBanned(player: Player | string) {
        const banInfo = this.getBanInformation(player as any);
        if (!banInfo) {
            return false;
        }
        return Date.now() < (banInfo.shouldEndTimestamp ?? Infinity);
    }

    public constructor() {
        super();

        world.afterEvents.playerSpawn.subscribe(this.onPlayerSpawn.bind(this));

        CommandManager.registerCommand(new BanCommand());
        CommandManager.registerCommand(new UnbanCommand());

        for (const [banned] of Object.entries(this.getBanInformation() ?? {})) {
            if (banned == "lastTimeChecked") {
                continue;
            }

            const info = this.getBanInformation(banned);
            Imaginary.LOGGER.debug(info);
            if (!info) {
                continue;
            }
            info.shouldEndTimestamp += Date.now() - this.getLastTimeChecked();

            this.savePlayer(info);
        }

        this.setLastTimeChecked(Date.now());

        this.runTimer(20);
        Imaginary.LOGGER.info("Ban Manager loaded and running");
    }

    public onPlayerSpawn(event: { player: Player }) {
        const { player } = event;

        if (!this.isBanned(player)) {
            return;
        }

        player.runCommand(`kick "${player.name}"`);
    }

    public override *onRunJob(): Generator<void, void, void> {
        if (!this.getBanInformation()) {
            return;
        }

        for (const [banned] of Object.entries(this.getBanInformation())) {
            if (banned == "lastTimeChecked") {
                continue;
            }

            if (this.isBanned(banned)) {
                continue;
            }

            this.unbanPlayer(banned);

            yield;
        }

        this.setLastTimeChecked(Date.now());
    }
}
