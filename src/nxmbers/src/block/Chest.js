import { EntityDamageCause, world } from "@minecraft/server";

world.afterEvents.playerInteractWithBlock.subscribe((arg) => {
    const { block, player } = arg

    if (!block.typeId.includes("chest")) {
        return;
    }

    if (Math.random() > 0.70) {
        return;
    }

    player.applyDamage(8, { "cause": EntityDamageCause.contact })
})

world.afterEvents.playerBreakBlock.subscribe((arg) => {
    const { block, player, brokenBlockPermutation } = arg
    if (!brokenBlockPermutation.type.id.includes("chest")) {
        return;
    }


    if (Math.random() > 0.70) {
        return;
    }

    player.applyDamage(8, { "cause": EntityDamageCause.contact })
})