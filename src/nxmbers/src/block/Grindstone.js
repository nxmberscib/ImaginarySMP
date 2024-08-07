import { EntityDamageCause, world } from "@minecraft/server";

world.afterEvents.playerInteractWithBlock.subscribe((arg) => {
    const { block, player } = arg

    if (block.typeId != "minecraft:grindstone" || Math.random() > 0.40) {
        return;
    }

    const location = block.location
    const { x, y, z } = location

    player.dimension.runCommand(`fill ${x} ${y} ${z} ${x} ${y} ${z} air destroy`)
    player.dimension.createExplosion(location, 12, { breaksBlocks: false, causesFire: true })
})

world.afterEvents.playerBreakBlock.subscribe((arg) => {
    const { block, player, brokenBlockPermutation } = arg

    if (brokenBlockPermutation.type.id != "minecraft:grindstone" || Math.random() > 0.40) {
        return;
    }

    const location = block.location
    const { x, y, z } = location
    
    player.dimension.runCommand(`fill ${x} ${y} ${z} ${x} ${y} ${z} air destroy`)
    player.dimension.createExplosion(location, 12, { breaksBlocks: false, causesFire: true })
})