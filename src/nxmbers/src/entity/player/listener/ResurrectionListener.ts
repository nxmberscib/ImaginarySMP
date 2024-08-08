import { EntityDamageCause, Player, world } from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";
import { EntityResurrectEvent } from "teseract/api/event/EntityResurrectEvent";

export default class ResurrectionListener {
    public constructor() {
        world.beforeEvents.entityResurrect.subscribe(
            this.onResurrection.bind(this),
        );
    }

    public onResurrection(event: EntityResurrectEvent) {
        const {
            entity: player,
            damage,
            damageSource: { damagingEntity: damager, cause },
        } = event;

        if (!(player instanceof Player)) {
            return;
        }

        if (Math.random() < 0.15) {
            this.blockRandomSlot(player);
        }

        player.runCommand(`function unnecessary_mechanics/contador_totems`);
    }

    public blockRandomSlot(player: Player) {
        const inventorySize = player.getComponent("inventory").inventorySize;
        const random = Math.floor(Math.random() * inventorySize);
        Imaginary.getInstance().getSlotManager().lockSlot(player, random);
    }
}
