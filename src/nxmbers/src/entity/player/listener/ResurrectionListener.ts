import { EntityDamageCause, Player, world } from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";
import WithLogger from "nxmbers/src/util/WithLogger";
import { EntityResurrectEvent } from "teseract/api/event/EntityResurrectEvent";

export default class ResurrectionListener extends WithLogger {
    public constructor() {
        super();
        world.beforeEvents.entityResurrect.subscribe(
            this.onResurrection.bind(this),
        );
        this.logger().robust("Player resurrect listener loaded");
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
                this.logger().debug(random);
                this.blockRandomSlot(player);
            }

            player.runCommand(`function unnecessary_mechanics/contador_totems`);
        } catch (error) {
            this.logger().error(error);
        }
    }

    private blockRandomSlot(player: Player) {
        try {
            const inventorySize =
                player.getComponent("inventory").inventorySize;
            const random = Math.floor(Math.random() * inventorySize);
            Imaginary.getSlotManager().lockSlot(player, random);
        } catch (error) {
            this.logger().error(error);
        }
    }
}
