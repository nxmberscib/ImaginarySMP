import { Player } from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";
import { BaseActionForm, FormButton } from "nxmbers/src/util/ui/ActionFormUtil";
import ToggleSwappableUI from "./ToggleSwappableUI";

export default class MainMenuUI extends BaseActionForm {
    public constructor() {
        super();
        this.title({translate:"ui.config_menu.main_title"})
    }

    @FormButton((player: Player) => {
        const enabled = Imaginary.getFastTotemManager().isSwappableEnabled(
            player,
            "minecraft:totem_of_undying",
        )
            ? { translate: "ui.swappable.enabled" }
            : { translate: "ui.swappable.disabled" };
        return {
            rawtext: [
                { translate: "ui.swappable.fast_totem" },
                { text: "\n" },
                enabled,
            ],
        };
    }, "textures/items/totem")
    private fastTotemSelected(player: Player) {
        new ToggleSwappableUI(
            "Fast Totem",
            "minecraft:totem_of_undying",
        ).sendForm(player);
    }

    @FormButton((player: Player) => {
        const enabled = Imaginary.getFastTotemManager().isSwappableEnabled(
            player,
            "minecraft:shield",
        )
            ? { translate: "ui.swappable.enabled" }
            : { translate: "ui.swappable.disabled" };
        return {
            rawtext: [
                { translate: "ui.swappable.fast_shield" },
                { text: "\n" },
                enabled,
            ],
        };
    }, "textures/ui/resistance_effect")
    private fastShieldSelected(player: Player) {
        new ToggleSwappableUI("Fast Shield", "minecraft:shield").sendForm(
            player,
        );
    }
}
