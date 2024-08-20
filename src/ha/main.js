// * @ts-check

import * as mc from '@minecraft/server';
// ! import * as debug from "@minecraft/debug-utilities";
import * as variable from './variables';
import * as loops from './loops';

import './chatRanks';
import './itemsUsed';
import './mobsName';
import './damageEvents';
import Imaginary from 'nxmbers/src/Imaginary';

let banSystem = true;
let lastSave = {};
let over = mc.world.getDimension("minecraft:overworld");

// ! No.
// debug.disableWatchdog(true);

/**
 * @deprecated in favour of nxmbers/src/Imaginary class
 */
// mc.world.afterEvents.worldInitialize.subscribe(setupWorld => {
// 	try {
// 		let dime = mc.world.getDimension('overworld');
// 		for (let command of variable.setupCommands) {
// 			dime.runCommandAsync(command);
// 		};
// 	} catch { };
// });

/**
 * @deprecated In favour of implementation of PlayerResurrectEvent
 */
// mc.world.afterEvents.entityHurt.subscribe(totemSensor => {
// 	try {
// 		let damage = totemSensor.damage;
// 		let entity = totemSensor.hurtEntity;
// 		let source = totemSensor.damageSource;
// 		if (entity?.typeId != 'minecraft:player') return;
// 		let health = entity.getComponent("minecraft:health");
// 		if (health.currentValue <= 0) {
// 			mc.system.run(() => {
// 				if (health.currentValue > 0) {
// 					entity.applyDamage(0, override);
// 				};
// 			});
// 		};
// 		if (damage > 0 || source.cause != 'none') return;
// 		health.setCurrentValue(health.defaultValue);
// 		entity.runCommand(`function unnecessary_mechanics/contador_totems`);
// 	} catch { };
// });

/**
 * @deprecated In favour of new fast totem system
 * @warning esa mamada qué
 */
// mc.world.afterEvents.itemUse.subscribe(async (itemUsed) => {
// 	try {
// 		const player = itemUsed.source;
// 		const item = itemUsed.itemStack;
// 		if (item.typeId == 'minecraft:totem_of_undying' || item.typeId == 'minecraft:shield') {
// 			const armorSlots = player.getComponent("minecraft:equippable");
// 			let itemOffHand = armorSlots.getEquipment("Offhand");
// 			let itemMainHand = armorSlots.getEquipment("Mainhand");
// 			const air = new mc.ItemStack("minecraft:air");
// 			if (itemOffHand) {
// 				if (itemOffHand.typeId == 'ha:barrier_fake') return;

// 				armorSlots.setEquipment("Offhand", itemMainHand);
// 				armorSlots.setEquipment("Mainhand", itemOffHand);
// 				player.playSound("armor.equip_generic");
// 				if (item.typeId == "minecraft:totem_of_undying") FastTotemHandicap(player)
// 			} else {
// 				armorSlots.setEquipment("Offhand", itemMainHand);
// 				armorSlots.setEquipment("Mainhand", air);
// 				player.playSound("armor.equip_generic");
// 				if (item.typeId == "minecraft:totem_of_undying") FastTotemHandicap(player)
// 			};
// 		};
// 	} catch (e) { console.error(e, e.stack) };
// });

mc.world.afterEvents.playerDimensionChange.subscribe(returnDime => {
	try {
		let player = returnDime.player;
		let fromDimension = returnDime.fromDimension;
		let toDimension = returnDime.toDimension;
		let fromLocation = mc.world.getDefaultSpawnLocation();
		if (toDimension.id == 'minecraft:the_end') {
			player.tryTeleport(fromLocation, { dimension: fromDimension });
			player.kill();
		} else if (toDimension.id == 'minecraft:nether') {
			mc.world.sendMessage({ translate: "chat.go_nether", with: { rawtext: [{ text: `${player.name}` }] } });
		} else if (fromDimension.id == 'minecraft:nether' && toDimension.id == 'minecraft:overworld') {
			mc.world.sendMessage({ translate: "chat.bye_nether", with: { rawtext: [{ text: `${player.name}` }] } });
		};
	} catch { };
});

/**
 * @deprecated 
 ** In favour of new BanManager
 */
// mc.world.afterEvents.playerSpawn.subscribe(playerSpawned => {
// 	try {
// 		let player = playerSpawned.player;
// 		if (banSystem) {
// 			if (player.hasTag("ban")) {
// 				player.removeTag("inCinematic");
// 				player.runCommand(`kick "${player.name}" `);
// 			};
// 		} else {
// 			if (player.hasTag("ban")) {
// 				player.runCommand(`function system/revive_player`);
// 			};
// 		};
// 		if (player.hasTag("cooldownTirar")) {
// 			loops.tumbarte(player, 1, 0);
// 		};
// 	} catch { };
// });


mc.system.afterEvents.scriptEventReceive.subscribe(async staticEvents => {
	try {
		let event = staticEvents.id;
		let entity = staticEvents.sourceEntity;
		switch (event) {
			case 'ha:activate_outro': {
				let message = { translate: "chat.coords", with: { rawtext: [{ text: `${entity.name}` }, { text: `${Math.round(entity.location.x)} ${Math.round(entity.location.y)} ${Math.round(entity.location.z)}` }, { text: `${dimensionName(entity.dimension.id)}` }] } };
				mc.world.sendMessage(message);
				mc.system.runTimeout(() => {
					entity.runCommand(`function unnecessary_cinematics/outro`);
				}, 156);
			} break;
			case 'ha:wait_ban': {
				mc.system.runTimeout(() => {
					entity.removeTag("inCinematic");
					/**
					 * @remarks
					 * NxmbersCib's BanManager replacement
					 */
					Imaginary.getBanManager().banPlayer(entity);
				}, 1000);
			} break;
			case 'ha:off_ban': {
				let message;
				if (banSystem) {
					message = { translate: "chat.ban_off" };
					banSystem = false;
				} else {
					message = { translate: "chat.ban_on" };
					banSystem = true;
				};
				entity.sendMessage(message);
				entity.playSound("random.screenshot");
			} break;
			case 'ha:set_coords': {
				let name = entity.name;
				let dime = entity.dimension;
				let coords = entity.location;
				let newItem = new mc.ItemStack("ha:limb_amulet_two");
				let inv = entity.getComponent("minecraft:inventory").container;
				if (lastSave[name]) {
					lastSave[name] = {
						playerName: name,
						lastDime: dime,
						lastCoords: coords
					};
				} else {
					lastSave[name] = {
						playerName: name,
						lastDime: dime,
						lastCoords: coords
					};
				};
				for (let i = 0; i < inv.size; i++) {
					let item = inv.getItem(i);
					if (item && item.typeId == 'ha:limb_amulet_one') {
						inv.setItem(i, newItem);
						break;
					};
				};
			} break;
			case 'ha:tp_coords': {
				let recoveryItem = new mc.ItemStack("ha:limb_amulet_one");
				let inv = entity.getComponent("minecraft:inventory").container;
				if (entity.hasTag("cooldownAmult")) {
					entity.sendMessage({ translate: "chat.cooldown_amulet" });
					return;
				} else {
					if (lastSave[entity.name]) {
						entity.addTag("cooldownAmult");
						cooldownAmult(entity);
						entity.addEffect("nausea", 100);
						entity.addEffect("blindness", 100);
						const runTemp1 = mc.system.runInterval(() => { entity.runCommand(`camera @s fade time 0 0 0.3 color 255 0 0`); }, 20);
						mc.system.runTimeout(() => {
							let dime = lastSave[entity.name].lastDime;
							let coords = lastSave[entity.name].lastCoords;
							entity.tryTeleport(coords, { dimension: dime });
							entity.playSound("ui.limbo_start");
							mc.system.clearRun(runTemp1);
						}, 96);
					} else {
						for (let i = 0; i < inv.size; i++) {
							let item = inv.getItem(i);
							if (item && item.typeId == 'ha:limb_amulet_two') {
								inv.setItem(i, recoveryItem);
								entity.playSound("random.break");
								break;
							};
						};
					};
				};
			} break;
			case 'ha:wait_intro': {
				console.warn("wait intro triggered")
				mc.system.runTimeout(() => {
					entity.runCommand(`function system/intro_message`);
				}, 1930);
			} break;
			case 'ha:spawn_fires': {
				let spawnLocation = entity.location;
				let spawnRadius = 5;
				const dimension = entity.dimension;
				for (let i = 0; i < 10; i++) {
					let randomX = spawnLocation.x + (Math.random() - 0.5) * spawnRadius * 2;
					let randomZ = spawnLocation.z + (Math.random() - 0.5) * spawnRadius * 2;
					let fireball = dimension.spawnEntity("minecraft:fireball<ha:spawn_fire_hole>", { x: randomX, y: spawnLocation.y + 2.5, z: randomZ });
					fireball.clearVelocity();
					await mc.system.waitTicks(1)
					if (!fireball.isValid()) {
						continue;
					}
					fireball.getComponent("projectile").shoot({ x: 0, y: 6.5, z: 0 })

					// fireball.applyImpulse({ x: 0, y: 2.5, z: 0 });
					// fireball.applyImpulse({ x: 0, y: 2.5, z: 0 });
					over.runCommand(`playsound mob.ghast.fireball @a ${spawnLocation.x} ${spawnLocation.y} ${spawnLocation.z}`);
				};
			} break;
			case 'ha:add_tag': {
				mc.system.runTimeout(() => {
					entity.addTag("isMove");
					entity.runCommand(`scriptevent ha:remove_tag`);
				}, 30);
			} break;
			case 'ha:remove_tag': {
				mc.system.runTimeout(() => {
					if (!entity.hasTag("isMove")) return;
					entity.removeTag("isMove");
					entity.playSound("random.levelup");
					entity.sendMessage({ translate: "chat.moveYet" });
				}, 130);
			} break;
			case 'ha:steal': {
				let inv = entity.getComponent("minecraft:inventory").container;
				let slotsItems = [];
				for (let i = 0; i < inv.size; i++) {
					if (inv.getItem(i) != null) {
						slotsItems.push(i);
					};
				};
				let randomItem = slotsItems[Math.floor(Math.random() * slotsItems.length)];
				inv.setItem(randomItem, null);
				blockOffhand(entity);
				entity.runCommand(`damage @s 0 fire`);
				entity.runCommand(`summon strider ~~~`);
			} break;
			case 'ha:lock_offhand': {
				blockOffhand(entity, true);
			} break;
		};
	} catch (error) {
		console.error(error, error.stack)
	};
});

function blockOffhand(player, repeatMode = false) {
	if (!repeatMode) {
		let dime = player.dimension;
		let equipArmor = player.getComponent("minecraft:equippable");
		let offItem = equipArmor.getEquipment("Offhand");
		let blockItem = new mc.ItemStack("ha:barrier_fake");
		blockItem.lockMode = mc.ItemLockMode.slot;
		if (offItem) {
			if (offItem.typeId == 'minecraft:barrier') return;
			dime.spawnItem(offItem, player.location);
			equipArmor.setEquipment("Offhand", blockItem);
		} else {
			equipArmor.setEquipment("Offhand", blockItem);
		};
	} else {
		if (player.hasTag("offHandLocked")) return;
		let dime = player.dimension;
		let equipArmor = player.getComponent("minecraft:equippable");
		let offItem = equipArmor.getEquipment("Offhand");
		let blockItem = new mc.ItemStack("ha:barrier_fake");
		blockItem.lockMode = mc.ItemLockMode.slot;
		if (offItem) {
			if (offItem.typeId == 'minecraft:barrier') return;
			dime.spawnItem(offItem, player.location);
			equipArmor.setEquipment("Offhand", blockItem);
		} else {
			equipArmor.setEquipment("Offhand", blockItem);
		};
		player.addTag("offHandLocked");
	};
};

function cooldownAmult(entity) {
	mc.system.runTimeout(cosa => {
		entity.removeTag("cooldownAmult");
	}, 400);
};

function dimensionName(dimensionId) {
	switch (dimensionId) {
		case 'minecraft:overworld': {
			return "§aOverworld";
		} break;
		case 'minecraft:nether': {
			return "§cNether";
		} break;
		case 'minecraft:the_end': {
			return "§dEnd";
		} break;
	};
};