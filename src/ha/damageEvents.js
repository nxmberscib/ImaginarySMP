/* Creado o Editado por: HaJuegosCat! y DiFox!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!y DiFox!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import * as mc from '@minecraft/server';
import * as variable from './variables.js';
import * as loops from './loops.js';

let over = mc.world.getDimension("minecraft:overworld");

mc.world.afterEvents.playerBreakBlock.subscribe(blockSensor => {
	try {
		let player = blockSensor.player;
		if (player.hasTag("potionBad4")) {
			player.runCommand(`damage @s 12 sonic_boom`);
		};
	} catch { };
});

mc.world.beforeEvents.entityRemove.subscribe(explotions => {
	try {
		let source = explotions.removedEntity;
		let dime = source.dimension;
		let coords = source.location;
		if (source.typeId == 'minecraft:creeper') {
			let variant = source.getComponent("minecraft:variant");
			if (variant.value != 1) return;
			mc.system.run(() => {
				dime.spawnEntity("ha:water_entity<ha:spawn_cloud_creeper>", coords);
			});
		};
	} catch { };
});

mc.world.afterEvents.entityDie.subscribe(dieSensor => {
	try {
		let source = dieSensor.damageSource;
		let damageEntity = source.damagingEntity;
		let entity = dieSensor.deadEntity;
		switch (entity.typeId) {
			case 'minecraft:strider': {
				damageEntity.runCommand(`function unnecessary_mechanics/strider_muerte`);
			} break;
			case 'minecraft:witch':
			case 'minecraft:spider':
			case 'minecraft:ravager':
			case 'ha:furnace_golem': {
				damageEntity.runCommand(`function unnecessary_mechanics/muerte_lol`);
			} break;
			case 'minecraft:player': {
				spawnInventory(entity);
			} break;
			case 'minecraft:warden': {
				over.spawnEntity("minecraft:allay<ha:spawn_supreme>", entity.location);
			} break;
			case 'minecraft:wither_skeleton': {
				for (let i = 0; i < 3; i++) {
					over.spawnEntity("minecraft:allay<ha:spawn_allay_wither>", entity.location);
				};
			} break;
			case 'ha:twofaced_genius': {
				damageEntity.runCommand(`function effects_loops/remove_debuffs`);
			} break;
			case 'minecraft:rabbit': {
				checkHelmet(damageEntity, entity.location, entity.dimension, entity);
			} break;
		};
	} catch { };
});

mc.world.afterEvents.entityHurt.subscribe(damageSensor => {
	try {
		let source = damageSensor.damageSource;
		let damageEntity = source.damagingEntity;
		let entity = damageSensor.hurtEntity;
		switch (damagingEntity.typeId) {
			case 'minecraft:phantom': {
				entity.runCommand(`ride @s start_riding @e[type=phantom,c=1,r=4] teleport_rider`);
				entity.addEffect("poison", 200, { amplifier: 4 });
				entity.addEffect("weakness", 200, { amplifier: 0 });
			} break;
		};
	} catch { };
});

mc.world.afterEvents.entityHitEntity.subscribe(hitPlayerSensor => {
	try {
		let hurtEntity = hitPlayerSensor.hitEntity;
		let meleeEntity = hitPlayerSensor.damagingEntity;
		if (hurtEntity.typeId == 'minecraft:player') {
			setCooldownShield(meleeEntity, hurtEntity, true);
		};

		switch (meleeEntity.typeId) {
			case 'minecraft:donkey':
			case 'minecraft:mule':
			case 'minecraft:horse':
			case 'minecraft:skeleton_horse':
			case 'minecraft:zombie_horse':
			case 'minecraft:camel': {
				hurtEntity.runCommand(`rider @s start_riding @e[type=${meleeEntity.typeId},c=1,r=3] teleport_rider`);
			} break;
		}
	} catch { };
});

mc.world.afterEvents.entityHitEntity.subscribe(hitSensor => {
	try {
		let hurtEntity = hitSensor.hitEntity;
		let meleeEntity = hitSensor.damagingEntity;
		switch (meleeEntity.typeId) {
			case 'minecraft:enderman': {
				let dime = hurtEntity.dimension;
				dime.spawnEntity("minecraft:boat<ha:spawn_from_enderman>", hurtEntity.location);
				hurtEntity.runCommand(`ride @s start_riding @e[type=boat,r=3,c=1] teleport_rider`);
			} break;
			case 'minecraft:dolphin': {
				let dime = hurtEntity.dimension;
				let entity = dime.spawnEntity("ha:water_entity_two<minecraft:entity_spawned>", hurtEntity.location);
				hurtEntity.runCommand(`ride @s start_riding @e[type=ha:water_entity_two,r=10,c=1] teleport_rider`);
				entity.applyKnockback(entity.location.x, entity.location.z, 0, -2.5);
			} break;
			case 'minecraft:donkey':
			case 'minecraft:zombie_pigman':
			case 'minecraft:frog': {
				if (hurtEntity instanceof mc.Player) {
					loops.tumbarte(hurtEntity, 40, 2);
				}
				meleeEntity.dimension.spawnEntity("minecraft:slime<ha:fuerza>", meleeEntity.location);
				meleeEntity.dimension.spawnEntity("minecraft:slime<ha:fuerza>", meleeEntity.location);
				hurtEntity.addEffect("weakness", 60, { amplifier: 3 });
				hurtEntity.addEffect("poison", 60, { amplifier: 5 });
			} break;
			case 'minecraft:endermite': {
				let variant = meleeEntity.getComponent("minecraft:variant");
				let randomChance = (Math.random() * 101);
				if (variant.value == 1) {
					hurtEntity.addEffect("nausea", 120, { amplifier: 0 });
					hurtEntity.addEffect("weakness", 120, { amplifier: 0 });
					if (randomChance <= 10) {
						hurtEntity.dimension.createExplosion(hurtEntity.location, 4, { source: meleeEntity, allowUnderwater: true });
					};
				} else if (variant.value == 2) {
					hurtEntity.addEffect("wither", 200, { amplifier: 1 });
					hurtEntity.addEffect("poison", 200, { amplifier: 1 });
				};
			} break;
			case 'minecraft:turtle': {
				meleeEntity.runCommand(`function mobs/turtleride`);
				let dime = hurtEntity.dimension;
				let entity = dime.spawnEntity("ha:water_entity<minecraft:entity_spawned>", hurtEntity.location);
				entity.applyKnockback(entity.location.x, entity.location.z, 0, -2.5);
				hurtEntity.runCommand(`ride @s start_riding @e[type=ha:water_entity,r=3,c=1] teleport_rider`);
			} break;
			case 'ha:walter_npc': {
				if (hurtEntity.typeId != 'minecraft:player') return;
				stopMove(hurtEntity, 40);
			} break;
			case 'minecraft:ravager': {
				hurtEntity.runCommand(`fill ~~~ ~~6~ air`);
				hurtEntity.runCommand(`setblock ~~4~ pointed_dripstone`);
				let chance = (Math.random() * 101);
				if (chance <= 50) {
					hurtEntity.runCommand(`summon tnt_minecart ~~5~ 0 0 minecraft:on_prime`);
				};
				hurtEntity.runCommand(`fill ~~~ ~~6~ air`);
				hurtEntity.runCommand(`setblock ~~5~ pointed_dripstone`);
				hurtEntity.runCommand(`summon ha:water_entity ~~~ 0 0 ha:spawn_cloud`);
			} break;
			case 'ha:furnace_golem':
			case 'minecraft:vindicator': {
				hurtEntity.runCommand(`fill ~~~ ~~6~ air`);
				hurtEntity.runCommand(`setblock ~~5~ pointed_dripstone`);
				hurtEntity.runCommand(`summon ha:water_entity ~~~ 0 0 ha:spawn_cloud`);
			} break;
			case 'minecraft:blaze': {
				over.createExplosion(hurtEntity.location, 6, { allowUnderwater: true, source: meleeEntity });
			} break;
			case 'minecraft:spider': {
				stealInventory(meleeEntity, hurtEntity);

				let variant = meleeEntity.getComponent("minecraft:variant");
				if (variant.value == 1) {
					hurtEntity.addEffect("wither", 10, { amplifier: 0 });
					hurtEntity.addEffect("weakness", 10, { amplifier: 0 });
					hurtEntity.runCommand(`fill ~1~1~-1 ~-1~-1~1 web`);
					meleeEntity.runCommand(`function mobs/turtleride`);
				};
			} break;
			case 'minecraft:fox': {
				let variant = meleeEntity.getComponent("minecraft:variant");
				if (variant.value == 2) {
					hurtEntity.runCommand(`summon lightning_bolt`);
					hurtEntity.addEffect("slowness", 200, { amplifier: 2 });
				} else if (variant.value == 3) {
					hurtEntity.runCommand(`fill ~~~ ~~6~ air`);
					hurtEntity.runCommand(`setblock ~~4~ pointed_dripstone`);
					let chance = (Math.random() * 101);
					if (chance <= 50) {
						hurtEntity.runCommand(`summon tnt_minecart ~~5~ 0 0 minecraft:on_prime`);
					};
				} else if (variant.value == 4) {
					hurtEntity.addEffect("poison", 200, { amplifier: 0 });
					hurtEntity.dimension.spawnEntity("ha:water_entity<ha:fox_cloud>", hurtEntity.location);
				};
			} break;
			case 'minecraft:vex': {
				over.createExplosion(hurtEntity.location, 13, { allowUnderwater: true, source: meleeEntity });
			} break;
			case 'minecraft:allay': {
				let variant = meleeEntity.getComponent("minecraft:variant");
				if (variant.value == 2) {
					over.createExplosion(hurtEntity.location, 5, { allowUnderwater: true, source: meleeEntity });
					hurtEntity.runCommand(`damage @s 10 sonic_boom entity @e[type=allay,c=1]`);
					switchCamera(hurtEntity, 40);
					stealInventory(meleeEntity, hurtEntity);
				} else if (variant.value == 3) {
					hurtEntity.addEffect("wither", 200, { amplifier: 1 });
				};
			} break;
			case 'minecraft:rabbit': {
				hurtEntity.addEffect("blindness", 140, { amplifier: 2 });
				hurtEntity.addEffect("poison", 140, { amplifier: 2 });
			} break;
			case 'minecraft:zombie': {
				hurtEntity.dimension.spawnEntity("ha:cake", hurtEntity.location);
			} break;
			case 'minecraft:zombie_horse': {
				hurtEntity.runCommand(`damage @s 6 void`);
				hurtEntity.addEffect("slowness", 40, { amplifier: 4 });
				hurtEntity.addEffect("poison", 40, { amplifier: 4 });
				deorderInventory(hurtEntity);
			} break;
			case 'minecraft:piglin': {
				let variant = meleeEntity.getComponent("minecraft:skin_id");
				if (variant.value == 1) {
					hurtEntity.addEffect("slowness", 40, { amplifier: 0 });
				};
			} break;
			case 'ha:plasma_fox': {
				let coords = meleeEntity.location;
				let coordsHurt = hurtEntity.location;
				let directionX = coordsHurt.x - coords.x;
				let directionZ = coordsHurt.z - coords.z;
				let magnitude = Math.sqrt(directionX * directionX + directionZ * directionZ);
				directionX /= magnitude;
				directionZ /= magnitude;
				hurtEntity.playSound("mob.warden.sonic_boom");
				hurtEntity.applyKnockback(directionX, directionZ, 10.0, 0.5);
				hurtEntity.runCommand(`particle minecraft:sonic_explosion ~~0.5~`);
			} break;
			case 'ha:sonic_vindicator': {
				let coords = meleeEntity.location;
				let coordsHurt = hurtEntity.location;
				let directionX = coordsHurt.x - coords.x;
				let directionZ = coordsHurt.z - coords.z;
				let magnitude = Math.sqrt(directionX * directionX + directionZ * directionZ);
				directionX /= magnitude;
				directionZ /= magnitude;
				hurtEntity.playSound("mob.warden.sonic_boom");
				hurtEntity.applyKnockback(directionX, directionZ, 4.0, 0.5);
				hurtEntity.runCommand(`particle minecraft:sonic_explosion ~~0.5~`);
			} break;
			case 'ha:galactic_piglin': {
				hurtEntity.dimension.spawnEntity("ha:plasma_fox", hurtEntity.location);
				hurtEntity.dimension.spawnEntity("ha:skeleton_defender", hurtEntity.location);
				hurtEntity.dimension.spawnEntity("ha:sonic_vindicator", hurtEntity.location);
				hurtEntity.dimension.spawnEntity("ha:cerdina", hurtEntity.location);
			} break;
			case 'minecraft:zombie_villager_v2': {
				let coords = meleeEntity.location;
				let coordsHurt = hurtEntity.location;
				let directionX = coordsHurt.x - coords.x;
				let directionZ = coordsHurt.z - coords.z;
				let magnitude = Math.sqrt(directionX * directionX + directionZ * directionZ);
				directionX /= magnitude;
				directionZ /= magnitude;
				hurtEntity.applyKnockback(directionX, directionZ, 0.0, 1.5);
			} break;
			case 'minecraft:bee': {
				hurtEntity.addEffect("poison", 360, { amplifier: 2 });
			} break;
		};
	} catch (e) {
		console.warn(e, e.stack);
	};
});

mc.world.afterEvents.projectileHitBlock.subscribe(hitBlock => {
	try {
		let source = hitBlock.source;
		let projectile = hitBlock.projectile;
		let block = hitBlock.getBlockHit().block;

		switch (source.typeId) {
			case 'minecraft:allay': {
				let variant = source.getComponent("minecraft:variant");
				if (variant.value != 2) return;
				source.tryTeleport({ x: block.location.x, y: block.location.y + 0.5, z: block.location.z, }, { checkForBlocks: false });
			} break;
			case 'ha:mechanical_ghast': {
				source.tryTeleport({ x: block.location.x, y: block.location.y + 0.5, z: block.location.z, }, { checkForBlocks: false });
			} break;
			case 'minecraft:skeleton': {
				let variant = source.getComponent("minecraft:variant");
				if (variant.value != 1) return;
				source.dimension.createExplosion(projectile.location, 3, { allowUnderwater: true, source: source, breaksBlocks: false });
			} break;
		};

		switch (projectile.typeId) {
			case 'minecraft:arrow': {
				if (source.typeId == 'ha:furnace_golem') {
					projectile.runCommand(`setblock ~~~ ha:fake_iron_block`);
					projectile.kill();
				} else if (source.typeId == 'minecraft:warden') {
					projectile.runCommand(`setblock ~~~ ha:fake_coal_block`);
					projectile.kill();
				};
			} break;
			case 'minecraft:snowball': {
				let variant = projectile.getComponent("minecraft:variant");
				if (variant.value == 1) {
					projectile.runCommand(`effect @e[r=10] slowness 20 2`);
					projectile.dimension.createExplosion(projectile.location, 6, { allowUnderwater: true, source: source });
					projectile.runCommand(`playsound items.star_explode @a ~~~`);
					projectile.kill();
				};
			} break;
			case 'ha:crowbar': {
				source.tryTeleport(projectile.location, { checkForBlocks: true });
				for (let entity of projectile.dimension.getEntities({ location: projectile.location, maxDistance: 10, excludeTypes: ['minecraft:player', 'minecraft:item', 'ha:crowbar', 'minecraft:xp_orb'] })) {
					projectile.dimension.createExplosion(entity.location, 5, { allowUnderwater: true, source: source });
				};
				source.runCommand(`loot spawn ~~~ loot "entities/crowbar"`);
				projectile.kill();
			} break;
		};
	} catch { };
});

mc.world.afterEvents.projectileHitEntity.subscribe(hitProyectSensor => {
	try {
		let source = hitProyectSensor.source;
		let entity = hitProyectSensor.getEntityHit().entity;
		let projectile = hitProyectSensor.projectile;

		switch (source.typeId) {
			case 'minecraft:snow_golem': {
				entity.addEffect("slowness", 200, { amplifier: 2 });
				if (!entity.typeId == 'minecraft:player') return;
				stopMove(entity, 60);
			} break;
			case 'ha:desert_skeleton': {
				entity.addEffect("poison", 140, { amplifier: 0 });
				entity.addEffect("hunger", 140, { amplifier: 2 });
			} break;
			case 'ha:christmas_skeleton': {
				entity.runCommand(`fill ~5 ~-5 ~-5 ~-5 ~5 ~5 powder_snow`);
				entity.addEffect("slowness", 5, { amplifier: 0 });
			} break;
			case 'ha:furnace_golem': {
				entity.playSound("dig.stone");
			} break;
			case 'minecraft:allay': {
				let variant = source.getComponent("minecraft:variant");
				if (variant.value != 2) return;
				source.tryTeleport(entity.location);
			} break;
			case 'ha:mechanical_ghast': {
				source.tryTeleport(entity.location);
			} break;
			case 'minecraft:skeleton': {
				let variant = source.getComponent("minecraft:variant");
				if (variant.value != 1) return;
				entity.tryTeleport(source.location);
				entity.dimension.createExplosion(entity.location, 3, { allowUnderwater: true, source: source, breaksBlocks: false });
			} break;
			case 'minecraft:frog': {
				source.dimension.spawnEntity("minecraft:magma_cube<ha:fuerza>", entity.location);
				source.dimension.spawnEntity("minecraft:magma_cube<ha:fuerza>", entity.location);
			} break;
			case 'ha:skeleton_defender':
			case 'minecraft:bee':
			case 'ha:galactic_piglin': {
				entity.dimension.createExplosion(entity.location, 3, { allowUnderwater: true, source: source });
			} break;
		};

		switch (projectile.typeId) {
			case 'minecraft:trident': {
				entity.dimension.createExplosion(entity.location, 6, { allowUnderwater: true, source: source });
			} break;
			case 'minecraft:snowball': {
				let variant = projectile.getComponent("minecraft:variant");
				if (variant.value == 1) {
					projectile.runCommand(`effect @e[r=10] slowness 20 2`);
					projectile.dimension.createExplosion(projectile.location, 6, { allowUnderwater: true, source: source });
					projectile.runCommand(`playsound items.star_explode @a ~~~`);
					projectile.kill();
				};
			} break;
			case 'ha:crowbar': {
				if (entity) entity.addEffect("slowness", 100, { amplifier: 100 });
				source.tryTeleport(projectile.location, { checkForBlocks: true });
			} break;
		};

		if (entity.typeId == 'minecraft:player') setCooldownShield(undefined, entity, false);
	} catch { };
});

mc.system.afterEvents.scriptEventReceive.subscribe(damageStaticEvents => {
	try {
		let entity = damageStaticEvents.sourceEntity || undefined;
		switch (damageStaticEvents.id) {
			case 'ha:damage_ghast': {
				const effects = ["slowness", "mining_fatigue", "instant_damage", "nausea", "blindness", "hunger", "weakness", "poison", "wither", "levitation", "bad_omen", "darkness"];
				const randomIndex = Math.floor(Math.random() * effects.length);
				const randomEffect = effects[randomIndex];
				entity.dimension.spawnEntity("minecraft:tnt<ha:spawn_tnt_mechanic>", entity.location);
				entity.addEffect(randomEffect, 200);
			} break;
			case 'ha:damage_creeper': {
				entity.addEffect("weakness", 80, { amplifier: 1 });
				entity.addEffect("slowness", 80, { amplifier: 1 });
				entity.addEffect("poison", 80, { amplifier: 1 });
			} break;
			case 'ha:pop_totem': {
				if (searchTotem(entity)) {
					entity.runCommand(`damage @s 40 sonic_boom`);
				};
			} break;
		};
	} catch { };
});

function searchTotem(entity) {
	let armorInv = entity.getComponent("minecraft:equippable");
	let mainHand = armorInv.getEquipment("Mainhand");
	let offHand = armorInv.getEquipment("Offhand");
	return (mainHand && mainHand.typeId == 'minecraft:totem_of_undying') || (offHand && offHand.typeId == 'minecraft:totem_of_undying');
};

function checkHelmet(player, coords, dime, deadEntity) {
	if (deadEntity.hasTag("noMore")) return;
	let equipArmor = player.getComponent("minecraft:equippable");
	let itemHead = equipArmor.getEquipment("Head");
	let itemDrop = new mc.ItemStack("minecraft:golden_apple", 1);
	if (itemHead && itemHead.typeId == 'ha:easter_helmet') {
		let chance = (Math.random() * 101);
		if (chance <= 80) {
			dime.spawnItem(itemDrop, coords);
			deadEntity.addTag("noMore");
		};
	};
};

function deorderInventory(player) {
	let inv = player.getComponent("minecraft:inventory").container;
	const invSize = inv.size;

	for (let i = invSize - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		inv.swapItems(i, j, inv);
	};
};

function switchCamera(player, sg) {
	if (player.hasTag("cooldownCamera")) return;
	player.addTag("cooldownCamera");
	player.runCommand(`camera @s set minecraft:third_person`);
	setCooldownShield(undefined, player, false);
	mc.system.runTimeout(() => {
		player.runCommand(`camera @s clear`);
	}, sg);
};

function spawnInventory(player) {
	let dime = player.dimension;
	let coords = player.location;
	let inv = player.getComponent("minecraft:inventory").container;
	let armorInv = player.getComponent("minecraft:equippable");
	const armorSlots = ['Head', 'Chest', 'Legs', 'Feet', 'Offhand'];
	dime.runCommand(`summon ha:custom_npc ${coords.x} ${coords.y} ${coords.z} 0 0 minecraft:entity_spawned "§c${player.name} Inventory§r"`);
	for (const entity of dime.getEntities({ type: 'ha:custom_npc', location: coords, maxDistance: 2 })) {
		let otherInv = entity.getComponent("minecraft:inventory").container;
		for (let i = 0; i < inv.size; i++) {
			let item = inv.getItem(i);
			if (item && item.typeId != 'minecraft:barrier') {
				inv.transferItem(i, otherInv);
			};
		};
		for (let slot of armorSlots) {
			let item = armorInv.getEquipment(slot);
			if (item && item.typeId != 'minecraft:barrier') {
				otherInv.addItem(item);
				armorInv.setEquipment(slot, null);
			};
		};
	};
};

function stealInventory(meleeEntity, player) {
	if (player.typeId != 'minecraft:player') return;
	let inv = player.getComponent("minecraft:inventory").container;
	let meleeInv = meleeEntity.getComponent("minecraft:inventory").container;
	let slotsItems = [];
	for (let i = 0; i < inv.size; i++) {
		if (inv.getItem(i) != null) {
			slotsItems.push(i);
		};
	};
	let randomItem = slotsItems[Math.floor(Math.random() * slotsItems.length)];
	inv.transferItem(randomItem, meleeInv);
};

function setCooldownShield(otherEntity, player, isEquip) {
	let inv = player.getComponent("minecraft:inventory").container;
	let equipInv = player.getComponent("minecraft:equippable");
	let offHand = equipInv.getEquipment("Offhand");
	let shield = new mc.ItemStack("minecraft:shield");
	let cooldown = shield.getComponent("minecraft:cooldown");
	for (let i = 0; i < inv.size; i++) {
		let item = inv.getItem(i);
		if (!item && item.typeId != 'minecraft:shield') continue;
		if (player.isSneaking) {
			if (!isEquip) {
				cooldown.startCooldown(player);
				player.playSound("random.break");
			} else {
				if (!otherEntity) return;
				for (let item of variable.listItemsCooldown) {
					const nameItem = item.replace(/"/g, "");
					otherEntity.runCommandAsync(`testfor @s[hasitem={item=${nameItem},location=slot.weapon.mainhand}]`).then(r => {
						if (r.successCount == 1) {
							setCooldownShield(undefined, player, false)
						};
					});
				};
			};
		};
	};
	if (offHand && offHand.typeId == 'minecraft:shield') {
		if (player.isSneaking) {
			if (!isEquip) {
				cooldown.startCooldown(player);
				player.playSound("random.break");
			} else {
				if (!otherEntity) return;
				for (let item of variable.listItemsCooldown) {
					const nameItem = item.replace(/"/g, "");
					otherEntity.runCommandAsync(`testfor @s[hasitem={item=${nameItem},location=slot.weapon.mainhand}]`).then(r => {
						if (r.successCount == 1) {
							setCooldownShield(undefined, player, false)
						};
					});
				};
			};
		};
	};
};

function stopMove(player, seconds) {
	if (player.hasTag("cooldownJump")) return;
	player.runCommand(`inputpermission set @s movement disabled`);
	player.addTag("cooldownJump");
	mc.system.runTimeout(() => {
		player.runCommand(`inputpermission set @s movement enabled`);
		player.removeTag("cooldownJump");
	}, seconds);
};
/* Creado o Editado por: HaJuegosCat! y DiFox!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!y DiFox!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */