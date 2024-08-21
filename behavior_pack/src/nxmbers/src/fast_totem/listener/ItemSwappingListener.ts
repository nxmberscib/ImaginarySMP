import { EquipmentSlot, ItemUseBeforeEvent, world } from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";
import ImaginaryItems from "nxmbers/src/item/ImaginaryItems";

export default class ItemSwappingListener {

    public constructor() {
        world.beforeEvents.itemUse.subscribe(this.generalSwapping.bind(this));
    }

    private async generalSwapping(event: ItemUseBeforeEvent) {
        const { itemStack, source: player } = event;

        if (!Imaginary.getFastTotemManager().SWAPPABLE_ITEMS.includes(itemStack?.typeId)) {
            return;
        }
        
        if (
            !Imaginary.getFastTotemManager().isSwappableEnabled(
                player,
                itemStack?.typeId,
            )
        ) {
            return;
        }
        await null;

        const equippable = player.getComponent("equippable");

        const offhandSlot = equippable.getEquipmentSlot(EquipmentSlot.Offhand);
        const mainHandSlot = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);

        // Fast totem handicap
        if (
            !Imaginary.getItemManager()
                .getRegistries()
                .hasObtainedItem(
                    player,
                    ImaginaryItems.AUREUM_FULMINATOR.ITEM_ID,
                )
        ) {
            player.dimension.spawnEntity(
                "minecraft:lightning_bolt",
                player.location,
            );
        }

        mainHandSlot.setItem(offhandSlot.getItem());
        offhandSlot.setItem(itemStack);
    }
}
