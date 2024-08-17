import { Player } from "@minecraft/server";

export default interface ObtainableItem {
    ITEM_ID: string;
    obtainedCallback(player: Player): void;
    unobtainedCallback(player: Player): void;
}
