/* Creado o Editado por: HaJuegosCat! y DiFox!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!y DiFox!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import * as mc from '@minecraft/server';
import Imaginary from 'nxmbers/src/Imaginary';
import CommandManager from "teseract/api/command/CommandManager";

const preRanks = {
	"default": {
		chatRank: "chat_rank.default",
		nameRank: "§d§l[SOÑADOR]§r"
	},
	"owner": {
		chatRank: "chat_rank.owner",
		nameRank: "§c§l[OWNER]§r"
	},
	"admin": {
		chatRank: "chat_rank.admin",
		nameRank: "§e§l[ADMIN]§r"
	},
	"vip": {
		chatRank: "chat_rank.vip",
		nameRank: "§a§l[VIP]§r"
	}
};

mc.world.afterEvents.playerSpawn.subscribe(playerSpawned => {
	try {
		let player = playerSpawned.player;
		if (player.name == 'ZimbaweVIP') {
			player.addTag("owner");
		};
		checkRank(player);
	} catch { };
});

mc.world.afterEvents.entityHealthChanged.subscribe(healthSensor => {
	try {
		let entity = healthSensor.entity;
		if (entity.typeId == 'minecraft:player') {
			checkRank(entity)
		};
	} catch { };
});

mc.world.beforeEvents.chatSend.subscribe(rankChat => {
	try {
		if (rankChat.message.startsWith(CommandManager.prefix) || Imaginary.getMuteManager().isMuted(rankChat.sender)) {
			return;
		}
		let sender = rankChat.sender;
		let message = rankChat.message;
		rankChat.cancel = true;
		checkRankChat(sender, message)
	} catch { };
});

function checkRankChat(player, msg) {
	let tags = player.getTags();
	let actualRank = tags.includes("owner") ? preRanks.owner.chatRank : tags.includes("admin") ? preRanks.admin.chatRank : tags.includes("vip") ? preRanks.vip.chatRank : preRanks.default.chatRank;
	let setRankMessage = { translate: "chat.ranks", with: { rawtext: [{ translate: `${actualRank}` }, { text: `${player.name}` }, { text: `${msg}` }] } };
	mc.world.sendMessage(setRankMessage);
};

function checkRank(player) {
	let health = player.getComponent("minecraft:health");
	let tags = player.getTags();
	let actualRank = tags.includes("owner") ? preRanks.owner.nameRank : tags.includes("admin") ? preRanks.admin.nameRank : tags.includes("vip") ? preRanks.vip.nameRank : preRanks.default.nameRank;
	player.nameTag = `${actualRank} ${player.name}\n§c${Math.round(health.currentValue)}/${Math.round(health.defaultValue)}`;
};
/* Creado o Editado por: HaJuegosCat! y DiFox!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!y DiFox!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */