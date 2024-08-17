import {
    PlayerLeaveBeforeEvent,
    PlayerSpawnAfterEvent,
    world,
} from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";
import ImaginaryItems from "nxmbers/src/item/ImaginaryItems";

export default class ConnectionListener {
    public constructor() {
        world.afterEvents.playerSpawn.subscribe(this.onJoin.bind(this));
        world.beforeEvents.playerLeave.subscribe(this.onLeave.bind(this));
        Imaginary.LOGGER.robust("Player connection listener loaded");
    }

    private onJoin(event: PlayerSpawnAfterEvent) {
        const { player, initialSpawn } = event;

        if (!initialSpawn) {
            return;
        }

        Imaginary.LOGGER.info(`Player '${player.name}' has joined Imaginary`);

        const itemManager = Imaginary.getItemManager();
        const registries = itemManager.getRegistries();

        if (
            !registries.hasObtainedItem(
                player,
                registries
                    .obtainableItemsRegistry()
                    .get(ImaginaryItems.AUREUM_FULMINATOR.ITEM_ID),
            )
        ) {
            Imaginary.getSlotManager().lockSlot(player, 1);
        }
    }

    private onLeave(event: PlayerLeaveBeforeEvent) {}
}
