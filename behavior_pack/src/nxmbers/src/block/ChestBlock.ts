import { EntityDamageCause, world } from "@minecraft/server";

export default class ChestBlock {
    private CHEST_ID_PARTIAL = "chest";

    public constructor() {
        world.afterEvents.playerInteractWithBlock.subscribe(this.onPlayerInteractWithBlock.bind(this));
        world.afterEvents.playerBreakBlock.subscribe(this.onPlayerBreakBlock.bind(this));
    }

    private onPlayerInteractWithBlock(arg: any) {
        const { block, player } = arg;

        if (!block.typeId.includes(this.CHEST_ID_PARTIAL)) {
            return;
        }

        if (Math.random() > 0.70) {
            return;
        }

        player.applyDamage(8, { cause: EntityDamageCause.contact });
    }

    private onPlayerBreakBlock(arg: any) {
        const { block, player, brokenBlockPermutation } = arg;

        if (!brokenBlockPermutation.type.id.includes(this.CHEST_ID_PARTIAL)) {
            return;
        }

        if (Math.random() > 0.70) {
            return;
        }

        player.applyDamage(8, { cause: EntityDamageCause.contact });
    }
}
