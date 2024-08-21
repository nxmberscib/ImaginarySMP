import { Player, world } from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";
import { EntityResurrectEvent } from "teseract/api/event/EntityResurrectEvent";

export default class ResurrectionListener {
    public constructor() {
        world.beforeEvents.entityResurrect.subscribe(
            this.onResurrection.bind(this),
        );
        Imaginary.LOGGER.robust("Player resurrect listener loaded");
    }

    private onResurrection(event: EntityResurrectEvent) {
        try {
            const {
                entity: player,
                damage,
                damageSource: { damagingEntity: damager, cause },
            } = event;

            if (!(player instanceof Player)) {
                return;
            }

            const random = Math.random();
            if (random < 0.15) {
                Imaginary.LOGGER.debug(random);
                this.blockRandomSlot(player);
            }

            player.runCommand(`function unnecessary_mechanics/contador_totems`);
        } catch (error) {
            Imaginary.LOGGER.error(error);
        }
    }

    private blockRandomSlot(player: Player) {
        try {
            const inventorySize =
                player.getComponent("inventory").inventorySize;
            const random = Math.floor(Math.random() * inventorySize);
            Imaginary.getSlotManager().lockSlot(player, random);
        } catch (error) {
            Imaginary.LOGGER.error(error);
        }
    }
}
