import { Player, world } from "@minecraft/server";
import ObtainableItem from "./manager/interface/ObtainableItem";
import Imaginary from "../Imaginary";

export default class AureumFulminatorItem implements ObtainableItem {
    public ITEM_ID: string = "cib:aureum_fulminator";

    public constructor() {
        Imaginary.getItemManager().getRegistries().registerObtainable(this);
        Imaginary.LOGGER.debug(this.ITEM_ID);
        Imaginary.LOGGER.robust("Aureum fulminator item loaded");
    }

    public obtainedCallback(player: Player): void {
        for (const player of world.getAllPlayers()) {
            player.playSound("items.obtained.aureum_fulminator_obtained");
        }

        world.sendMessage({
            translate: "chat.feedback.item.aureum_fulminator",
            with: [player.name],
        });
    }

    public unobtainedCallback(player: Player): void {}
}
