import { EntityDamageCause, world } from "@minecraft/server";

export default class BrewingStandBlock {
    private BREWING_STAND_ID = "minecraft:brewing_stand";

    public constructor() {
        world.afterEvents.playerInteractWithBlock.subscribe(this.onPlayerInteractWithBlock.bind(this));
        world.afterEvents.playerBreakBlock.subscribe(this.onPlayerBreakBlock.bind(this));
    }

    private onPlayerInteractWithBlock(arg: any) {
        const { block, player } = arg;

        if (block?.typeId != this.BREWING_STAND_ID || Math.random() > 0.40) {
            return;
        }

        const location = block.location;
        const { x, y, z } = location;

        player.dimension.runCommand(`fill ${x} ${y} ${z} ${x} ${y} ${z} air destroy`);
        player.dimension.createExplosion(location, 12, { breaksBlocks: false, causesFire: true });
    }

    private onPlayerBreakBlock(arg: any) {
        const { block, player, brokenBlockPermutation } = arg;

        if (brokenBlockPermutation.type.id != this.BREWING_STAND_ID || Math.random() > 0.40) {
            return;
        }

        const location = block.location;
        const { x, y, z } = location;

        player.dimension.runCommand(`fill ${x} ${y} ${z} ${x} ${y} ${z} air destroy`);
        player.dimension.createExplosion(location, 12, { breaksBlocks: false, causesFire: true });
    }
}
