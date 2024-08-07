import { Player, system } from "@minecraft/server";

function reroll(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min)
}

/**
 * Randomly drops an item from player's inventory.
 * @param player Player whose inventory will drop one random item. 
 */
export default function FastTotemHandicap(player: Player) {
    player.dimension.spawnEntity("minecraft:lightning_bolt", player.location)
}



