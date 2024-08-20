## Creado o Editado por: HaJuegosCat! y DiFox!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz
## Created or Edited by: HaJuegosCat!y DiFox!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz

gamemode spectator

scoreboard players remove "score.name.lives" totalLives 1
scoreboard players add "score.name.death" totalLives 1

effect @a blindness 7

titleraw @a[tag=!inIntro,tag=!muerto] title {"rawtext": [{"text": "§r§l§k§hLL§r §l§dI§cM§aA§3G§6I§nN§gA§4R§2Y §r§l§k§hLL"}]}
execute as @s at @s run titleraw @a[tag=!inIntro,tag=!muerto] subtitle {"rawtext": [{"translate": "ui.subtitle_death", "with": {"rawtext": [{"selector": "@s"}]}}]}
execute as @s at @s run tellraw @a[tag=!inIntro,tag=!muerto] {"rawtext": [{"translate": "chat.death_message1", "with": {"rawtext": [{"selector": "@s"}]}}]}
tellraw @a {"rawtext": [{"translate": "chat.death_message2"}]}
tellraw @a {"rawtext": [{"translate": "chat.death_message3"}]}

execute as @a[tag=!inIntro,tag=!muerto] at @s run playsound ui.death_sound

tag @s add muerto
tag @s add inCinematic
inputpermission set @s movement disabled
inputpermission set @s camera disabled

scriptevent ha:activate_outro