import { Player } from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";
import { BaseMessageForm, Button1, Button2 } from "nxmbers/src/util/ui/MessageFormUtil";

export default class ToggleSwappableUI extends BaseMessageForm {
    public constructor(swappable: string, private swappableId: string) {
        super();
        this.title({
            translate: "ui.swappable.toggle_swappable",
            with: [swappable],
        });
    }

    @Button2({ translate: "ui.swappable.enable_option" })
    private onEnable(player: Player) {
        Imaginary.getFastTotemManager().toggleSwappable(
            player,
            this.swappableId,
            true,
        );
        player.playSound("random.orb");
    }

    @Button1({ translate: "ui.swappable.disable_option" })
    private onDisable(player: Player) {
        Imaginary.getFastTotemManager().toggleSwappable(
            player,
            this.swappableId,
            false,
        );
        player.playSound("random.orb");
    }
}
