import { Player, RawMessage } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import ForceOpenForm from "./ForceOpenForm";

export function FormButton(
    buttonText: RawMessage | string | ((player: Player) => RawMessage | string),
    iconPath: string,
) {
    return function (
        target: BaseActionForm,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) {
        if (!target.constructor["_buttons"]) {
            target.constructor["_buttons"] = [];
        }
        target.constructor["_buttons"].push({
            buttonText,
            iconPath,
            callback: descriptor.value,
        });
    };
}

export abstract class BaseActionForm extends ActionFormData {
    private _buttons: {
        buttonText: RawMessage | string | ((player: Player) => RawMessage | string);
        iconPath: string;
        callback: (player: Player) => void;
    }[] = [];

    constructor() {
        super();
    }

    public async sendForm(player: Player) {
        await null;
        for (const button of this.constructor["_buttons"]) {
            const text = typeof button.buttonText === "function"
                ? button.buttonText(player)
                : button.buttonText;
            this.button(text, button.iconPath);
        }

        const response = await ForceOpenForm(player, this);

        if (response.canceled) {
            return;
        }

        const selectedButton = this.constructor["_buttons"][response.selection];
        if (selectedButton && selectedButton.callback) {
            selectedButton.callback.call(this, player);
        }
    }
}
