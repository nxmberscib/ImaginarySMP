import { ItemUseOnBeforeEvent, world } from "@minecraft/server";

export default class VaultBlock {
    private VAULT_KEY_ID = "minecraft:trial_key";
    private VAULT_BLOCK_ID = "minecraft:vault";

    public constructor() {
        world.beforeEvents.itemUseOn.subscribe(this.onTrialKeyUsed);
    }

    private onTrialKeyUsed(event: ItemUseOnBeforeEvent) {
        if (
            event.itemStack?.typeId != this.VAULT_KEY_ID ||
            event.block?.typeId != this.VAULT_BLOCK_ID
        ) {
            return;
        }

        event.cancel = true;
    }
}
