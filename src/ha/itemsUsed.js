/* Creado o Editado por: HaJuegosCat! y DiFox!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!y DiFox!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import * as mc from '@minecraft/server';

const itemEffects = {
    'ha:marble_apple': [
        { effect: "regeneration", duration: 200, amplifier: 1 },
        { effect: "absorption", duration: 400, amplifier: 1 },
        { effect: "saturation", duration: 200, amplifier: 0 },
        { effect: "slow_falling", duration: 100, amplifier: 0 }
    ],
    'ha:caramel_apple': [
        { effect: "regeneration", duration: 100, amplifier: 2 },
        { effect: "resistance", duration: 100, amplifier: 2 }
    ],
    'ha:chocomilk': [
        { effect: "speed", duration: 320, amplifier: 1 },
        { effect: "resistance", duration: 320, amplifier: 1 }
    ],
    'ha:apple_pie': [
        { effect: "regeneration", duration: 600, amplifier: 3 },
        { effect: "absorption", duration: 2400, amplifier: 2 },
        { effect: "resistance", duration: 6000, amplifier: 0 },
        { effect: "fire_resistance", duration: 6000, amplifier: 0 }
    ],
    'ha:imagination_apple': [
        { effect: "levitation", duration: 40, amplifier: 4 },
        { effect: "resistance", duration: 40, amplifier: 2 },
        { effect: "regeneration", duration: 100, amplifier: 2 },
        { effect: "jump_boost", duration: 60, amplifier: 1 }
    ],
	'ha:iron_carrot': [
        { effect: "night_vision", duration: 200, amplifier: 0 },
        { effect: "resistance", duration: 100, amplifier: 1 },
        { effect: "saturation", duration: 140, amplifier: 1 }
    ],
	'ha:bad_potion_one': [
		{ command: [ `tag @s add potionBad1`, `playsound ui.drink_item` ]}
	],
	'ha:bad_potion_two': [
		{ command: [ `tag @s add potionBad2`, `playsound ui.drink_item` ]}
	],
	'ha:bad_potion_three': [
		{ command: [ `tag @s add potionBad3`, `playsound ui.drink_item` ]}
	],
	'ha:bad_potion_four': [
		{ command: [ `tag @s add potionBad4`, `playsound ui.drink_item`, `event entity @s ha:set_max_hearts` ]}
	],
	'ha:bad_potion_five': [
		{ command: [ `tag @s add potionBad5`, `playsound ui.drink_item` ]}
	]
};

mc.world.afterEvents.itemCompleteUse.subscribe(itemsUsed => {
	try {
		let player = itemsUsed.source;
		let item = itemsUsed.itemStack;
		const effects = itemEffects[item.typeId];
        if (effects) {
            for (const effect of effects) {
                if (effect.command) {
                    for (const command of effect.command) {
                        if (player.hasTag("potionBad1") || player.hasTag("potionBad2") || player.hasTag("potionBad3") || player.hasTag("potionBad4") || player.hasTag("potionBad5")) {
							player.sendMessage({ translate: "chat.nodrink" });
							return;
						} else {
							player.runCommand(command);
						};
                    };
                } else {
                    player.addEffect(effect.effect, effect.duration, { amplifier: effect.amplifier });
                };
            };
        };
	} catch {};
});
/* Creado o Editado por: HaJuegosCat! y DiFox!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!y DiFox!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */