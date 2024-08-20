import { ItemUseBeforeEvent, Player, world } from "@minecraft/server";
import ObtainableItem from "./manager/interface/ObtainableItem";
import Imaginary from "../Imaginary";
import ShootSonicBoom from "../util/entity/ShootSonicBoom";
import { Vector2Builder, Vector3Builder } from "../util/vector/VectorWrapper";
import TimerUtils from "teseract/api/util/TimerUtils";
import ImaginaryItems from "./ImaginaryItems";

export default class AureumFulminatorItem implements ObtainableItem {
    public ITEM_ID: string = "cib:aureum_fulminator";

    public constructor() {
        Imaginary.getItemManager().getRegistries().registerObtainable(this);
        world.afterEvents.itemUse.subscribe(this.onItemUsed.bind(this));
        Imaginary.LOGGER.robust("Aureum fulminator item loaded");
    }

    private onItemUsed(event: ItemUseBeforeEvent) {
        const { itemStack, source: player } = event;
        if (itemStack.typeId != this.ITEM_ID) {
            return;
        }
        const cooldown = player.getItemCooldown("slime_wand");

        if (cooldown != 0) {
            return;
        }

        player.startItemCooldown(
            "aureum_fulminator",
            TimerUtils.fromSecondsToTicks(15),
        );

        Imaginary.getSlotManager().unlockAllSlots(player);
        
        // Este código de aquí NO debería ejecutarse nunca, pues si tienes el fulminador aureo (es decir, estas ejecutando este evento, obviamente lo tienes) deberías tener ese slot en false. Añadí un critical log en este lugar para que se envíe cuando sea pertinente en Discord.
        
        if (
            !Imaginary.getItemManager()
                .getRegistries()
                .hasObtainedItem(
                    player,
                    ImaginaryItems.AUREUM_FULMINATOR.ITEM_ID,
                )
        ) {
            Imaginary.LOGGER.critical("A player who fired aureum fulminator itemUseEvent haven't obtained an aureum fulminator?? Registries.hasObtainedItem returned false.")
            Imaginary.getSlotManager().lockSlot(player, 1);
        }
    }

    public obtainedCallback(player: Player): void {
        for (const player of world.getAllPlayers()) {
            player.playSound("items.obtained.aureum_fulminator_obtained");
        }

        world.sendMessage({
            translate: "chat.feedback.item.aureum_fulminator",
            with: [player.name],
        });

        Imaginary.getSlotManager().unlockSlot(player, 1);

        Imaginary.LOGGER.robust(`${player.name} obtained an aureum fulminator`);
    }

    public unobtainedCallback(player: Player): void {
        Imaginary.getSlotManager().lockSlot(player, 1);
        Imaginary.LOGGER.robust(
            `${player.name} unobtained an aureum fulminator, maybe this was triggered by an admin?`,
        );
    }
}
