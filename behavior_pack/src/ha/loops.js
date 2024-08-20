/* Creado o Editado por: HaJuegosCat! y DiFox!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!y DiFox!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import * as mc from '@minecraft/server';

let over = mc.world.getDimension("overworld");
let jobRun = 0;

mc.system.runInterval(loopPotion => {
	try {
		for (const players of over.getEntities({ type: 'minecraft:player', tags: [ 'potionBad5' ] })) {
			destroyTotem(players);
		};
	} catch {};
}, 1200);

mc.system.runInterval(loopHeight => {
	try {
		for (const player of mc.world.getPlayers()) {
			let coords = { x: Math.round(player.location.x), y: Math.round(player.location.y), z: Math.round(player.location.z) };
			if (coords.y <= -40) {
				players.addEffect("darkness", 120, { amplifier: 0 });
				players.addEffect("mining_fatigue", 120, { amplifier: 0 });
			} else if (coords.y >= 100) {
				players.addEffect("levitation", 120, { amplifier: 0 });
				players.addEffect("nausea", 120, { amplifier: 0 });
			};
		};
	} catch {};
}, 100);

mc.system.runInterval(loopCramp => {
	try {
		for (const players of mc.world.getPlayers()) {
			if (players.hasTag("cooldownCramp")) return;
			players.runCommand(`damage @s 0 fire`);
			players.addEffect("slowness", 1200, { amplifier: 0 });
			players.addTag("inCramp");
			players.addTag("cooldownCramp");
			players.sendMessage({ translate: "chat.cramp" });
			timeRemoveEffect(players, 1200);
		};
	} catch {};
}, 12000);

mc.system.runInterval(loopJump => {
	try {
		for (const entity of over.getEntities({ type: 'ha:nothing' })) {
			if (!entity.hasTag("spawnWalt")) {
				over.runCommand(`execute as @a at @s run summon ha:walter_npc`);
				over.runCommand(`execute as @a at @s run playsound ui.bb_sound`);
				entity.addTag("spawnWalt");
			};
		};
		for (const player of mc.world.getPlayers()) {
			if (searchTrident(player)) {
				dropEnder(player);
			};
			
			if (!player.isSneaking) {
				player.addTag("isNoSneaking");
			} else {
				player.removeTag("isNoSneaking");
			};
		};
	} catch {};
}, 5);

mc.system.runInterval(loopFire => {
	try {
		for (const players of over.getEntities({ type: 'minecraft:player', excludeTags: [ 'muerto', 'inIntro', 'inCinematic' ]})) {
			players.runCommand(`summon ha:really ~~-0.5~`);
		};
	} catch {};
}, 12000);

mc.system.runInterval(loopStar => {
	try {
		for (const players of over.getEntities({ type: 'minecraft:player', excludeTags: [ 'hasStar', 'muerto', 'inIntro', 'inCinematic' ]})) {
			selectUnfortunate(players);
		};
	} catch {};
}, 1800);

mc.system.runInterval(loopTotem => {
	try {
		over.spawnEntity("ha:nothing<minecraft:entity_spawned>", { x: 0, y: 100, z: 0 });
	} catch {};
}, 18000);

mc.world.afterEvents.itemCompleteUse.subscribe(usedCleanItems => {
	try {
		let player = usedCleanItems.source;
		let item = usedCleanItems.itemStack;
		switch (item.typeId) {
			case 'minecraft:potion': {
				if (player.hasTag("inCramp")) {
					player.runCommand(`effect @s slowness 0 0`);
					reloadTimeRemoveEffect(player, 1, jobRun);
				};
			} break;
			case 'minecraft:honey_bottle': 
			case 'minecraft:milk_bucket': {
				if (player.hasTag("inCramp")) {
					player.addEffect("slowness", 1200, { amplifier: 0 });
					reloadTimeRemoveEffect(player, 1200, jobRun);
				};
			} break;
		};
	} catch {};
});

function destroyTotem(player) {
	let equipArmor = player.getComponent("minecraft:equippable");
	let offItem = equipArmor.getEquipment("Offhand");
	if (offItem) {
		if (offItem.typeId == 'minecraft:totem') return;
		player.runCommand(`damage @s 999 sonic_boom`);
	};
};

/**
 * @param { mc.Player} player
 */
function dropEnder(player) {
	let inv = player.getComponent("minecraft:inventory").container;
	let dime = player.dimension;
	let coords = player.location;
	let randomX = Math.random() * 10 - 3;
	let randomZ = Math.random() * 10 - 3;
	let newCoords = { x: coords.x + randomX, y: coords.y, z: coords.z + randomZ };
	
	for (let i = 0; i < inv.size; i++) {
		let item = inv.getItem(i);
		if (item && item.typeId == 'minecraft:ender_pearl') {
			dime.spawnItem(item, newCoords);
			inv.setItem(i, null);
		};
	};
};

function searchTrident(player) {
	let inv = player.getComponent("minecraft:inventory").container;
	for (let i = 0; i < inv.size; i++) {
		let item = inv.getItem(i);
		if (item && item.typeId == 'minecraft:trident') {
			return true;
		};
	};
	return false;
};

function reloadTimeRemoveEffect(player, sg, job) {
	mc.system.clearJob(job);
	const timerSlow = mc.system.runTimeout(() => {
		player.removeTag("inCramp");
		player.removeTag("cooldownCramp");
	}, sg);
};

function timeRemoveEffect(player, sg) {
	const timerSlow = mc.system.runTimeout(() => {
		player.removeTag("inCramp");
		player.removeTag("cooldownCramp");
	}, sg);
	jobRun = timerSlow;
};

function selectUnfortunate(player) {
	let randomChance = Math.floor(Math.random() * 8);
	switch (randomChance) {
		case 1: {
			player.runCommand(`fill ~3 ~ ~-3 ~-3 ~ ~3 web`);
		} break;
		case 2: {
			let shield = new mc.ItemStack("minecraft:shield");
			let cooldown = shield.getComponent("minecraft:cooldown");
			cooldown.startCooldown(player);
			player.playSound("random.break");
		} break;
		case 3: {
			player.runCommand(`execute as @s[hasitem={item=totem,location=slot.weapon.offhand,quantity=!0}] at @s run damage @s 9999`);
		} break;
		case 4: {
			player.runCommand(`title @s subtitle plumaswe`);
			player.runCommand(`title @s title §r`);
			mc.system.runTimeout(() => {
				player.runCommand(`title @s subtitle §r`);
				player.runCommand(`title @s title §r`);
			}, 100);
		} break;
		case 5: {
			tumbarte(player, 100, 10);
		} break;
		case 6: {
			player.runCommand(`summon lightning_bolt`);
		} break;
		case 7: {
			player.runCommand(`summon tnt`);
		} break;
	};
};

/**
 * 
 * @param {mc.Player} player 
 * @param {number} sg 
 * @param {number} msgTime 
 * @returns 
 */
export function tumbarte(player, sg, msgTime) {
	if (player.hasTag("cooldownTirar")) return;
	player.addTag("cooldownTirar");
	player.sendMessage({translate: "chat.unnecessaryfuckingmechanicssofuckedup", with: {rawtext: [{text: `${msgTime}`}]}});
	player.runCommand(`function unnecessary_mechanics/go_to_sleep`);
	mc.system.runTimeout(() => {
		player.removeTag("cooldownTirar");
		player.runCommand(`inputpermission set @s movement enabled`);
		player.sendMessage({translate: "chat.unnecessaryfuckingmechanicssofuckedup_remove"});
		player.playSound("mob.zombie.unfect");
		player.triggerEvent("ha:remove_tirar");
	}, sg);
};
/* Creado o Editado por: HaJuegosCat! y DiFox!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!y DiFox!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */