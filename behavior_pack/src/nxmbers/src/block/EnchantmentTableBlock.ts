import { world } from "@minecraft/server";

export default class EnchantmentTableBlock {
    private ENCHANTING_TABLE_ID = "minecraft:enchanting_table";

    public constructor() {
        world.afterEvents.playerInteractWithBlock.subscribe(
            this.onPlayerInteractWithBlock.bind(this),
        );
        world.afterEvents.playerBreakBlock.subscribe(
            this.onPlayerBreakBlock.bind(this),
        );
    }

    private onPlayerInteractWithBlock(arg: any) {
        const { block, player } = arg;

        if (block?.typeId != this.ENCHANTING_TABLE_ID || Math.random() > 0.4) {
            return;
        }

        const location = block.location;
        const { x, y, z } = location;

        player.dimension.runCommand(
            `fill ${x} ${y} ${z} ${x} ${y} ${z} air destroy`,
        );
        player.dimension.createExplosion(location, 12, {
            breaksBlocks: false,
            causesFire: true,
        });
    }

    private onPlayerBreakBlock(arg: any) {
        const { block, player, brokenBlockPermutation } = arg;

        if (
            brokenBlockPermutation.type.id != this.ENCHANTING_TABLE_ID ||
            Math.random() > 0.4
        ) {
            return;
        }

        const location = block.location;
        const { x, y, z } = location;

        player.dimension.runCommand(
            `fill ${x} ${y} ${z} ${x} ${y} ${z} air destroy`,
        );
        player.dimension.createExplosion(location, 12, {
            breaksBlocks: false,
            causesFire: true,
        });
    }
}
