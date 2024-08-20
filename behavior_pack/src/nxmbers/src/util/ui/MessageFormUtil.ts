import { Player, RawMessage } from "@minecraft/server";
import { MessageFormData } from "@minecraft/server-ui";
import ForceOpenForm from "./ForceOpenForm";
import Imaginary from "nxmbers/src/Imaginary";

export function Button1(buttonText: RawMessage | string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        target.constructor._button1 = { buttonText, callback: descriptor.value };
    };
}

export function Button2(buttonText: RawMessage | string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        target.constructor._button2 = { buttonText, callback: descriptor.value };
    };
}

export abstract class BaseMessageForm extends MessageFormData {
    private _button1: { buttonText: RawMessage | string, callback: () => void };
    private _button2: { buttonText: RawMessage | string, callback: () => void };

    constructor() {
        super();
        this.initializeButtons();
    }

    private initializeButtons() {
        if (this.constructor["_button1"]) {
            this.button1(this.constructor["_button1"].buttonText);
        }
        if (this.constructor["_button2"]) {
            this.button2(this.constructor["_button2"].buttonText);
        }
    }

    public async sendForm(player: Player) {
        await null
        const response = await ForceOpenForm(player, this);

        if (response.canceled) {
            return;
        }

        if (response.selection === 0 && this.constructor["_button1"]?.callback) {
            this.constructor["_button1"].callback.call(this, player);
        } else if (response.selection === 1 && this.constructor["_button2"]?.callback) {
            this.constructor["_button2"].callback.call(this, player);
        }
    }
}