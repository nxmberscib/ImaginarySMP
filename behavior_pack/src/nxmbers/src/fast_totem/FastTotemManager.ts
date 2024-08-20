import Imaginary from "nxmbers/src/Imaginary";
import ItemSwappingListener from "./listener/ItemSwappingListener";
import { Player } from "@minecraft/server";
import MainMenuUI from "./ui/MainMenuUI";

export default class FastTotemManager {
    public readonly SWAPPABLE_ITEMS: string[] = [
        "minecraft:totem_of_undying",
        "minecraft:shield",
    ];

    public constructor() {
        new ItemSwappingListener();
        Imaginary.LOGGER.info("Fast totem loaded");
    }

    private formatSwappable(swappable: string) {
        return `swappable:${swappable}`;
    }

    public toggleSwappable(
        player: Player,
        swappable: string,
        enabled?: boolean,
    ) {
        let isEnabled = enabled;
        console.warn(enabled);
        if (enabled == undefined) {
            isEnabled = !this.isSwappableEnabled(player, swappable);
        }

        return player.setDynamicProperty(
            this.formatSwappable(swappable),
            isEnabled,
        );
    }

    public isSwappableEnabled(player: Player, swappable: string) {
        return (player.getDynamicProperty(this.formatSwappable(swappable)) ??
            true) as boolean;
    }

    public showConfigMenu(player: Player) {
        new MainMenuUI().sendForm(player);
    }
}
