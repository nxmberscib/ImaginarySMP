

import * as mc from '@minecraft/server';

const entityNames = {
    'minecraft:zombie_pigman': "§dHombre Cerdo§r",
    'minecraft:dolphin': "§bOrca Marina§r",
    'minecraft:endermite': variant => variant.value == 2 ? "§cCaracol Infernal§r" : variant.value == 1 ? "§6Gusano Profundo§r" : null,
    'minecraft:allay': variant => variant.value == 1 ? "§sHada§r" : null,
    'minecraft:turtle': "§eTortuga Floreada§r",
    'minecraft:snow_golem': "§aCopo Navideño§r",
    'ha:blood_slime': "§4Slime de Sangre§r",
	'minecraft:blaze': variant => variant.value == 1 ? "§sBlaze de Lámpara§r" : null,
	'minecraft:spider': variant => variant.value == 1 ? "§6Araña Pegadiza§r" : null,
	'minecraft:skeleton': variant => variant.value == 1 ? "§7Esqueletos Dispensadores§r" : null,
	'minecraft:vindicator': variant => variant.value == 1 ? "§cVindicador payaso§r" : null,
	'ha:furnace_golem': "§6Golem Horno§r",
	'minecraft:phantom': variant => variant.value == 1 ? "§aMariposas de Atracción§r" : null,
	'minecraft:strider': variant => variant.value == 1 ? "§bBarril patudo§r" : null,
	'minecraft:creeper': variant => variant.value == 1 ? "§gCreeper Mapel§r" : null,
	'minecraft:warden': variant => variant.value == 1 ? "§bMonstruo de Tinta§r" : null,
	'minecraft:wither': variant => variant.value == 1 ? "§gEspanta Pajaros§r" : null,
	'minecraft:frog': variant => variant.value == 3 ? "Patrullitas" : null,
    'cib:crystalline_skeleton': () => "§dEsqueleto Cristalino"
};

mc.world.afterEvents.entitySpawn.subscribe(entitySpawned => {
    try {
        let entity = entitySpawned.entity;
        const entityType = entity.typeId;
        const nameTag = entityNames[entityType];
        if (typeof nameTag == 'function') {
            const variant = entity.getComponent("minecraft:variant");
            entity.nameTag = nameTag(variant) || "";
        } else if (nameTag) {
            entity.nameTag = nameTag;
        };
    } catch {};
});

