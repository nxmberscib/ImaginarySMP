## Creado o Editado por: HaJuegosCat! y DiFox!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz
## Created or Edited by: HaJuegosCat!y DiFox!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz

gamemode s

scoreboard players add "score.name.lives" totalLives 1
scoreboard players remove "score.name.death" totalLives 1

execute as @a at @s run playsound ui.revive_sound

titleraw @s title {"rawtext": [{"text": "§d§lIMAGINARY"}]}
titleraw @s subtitle {"rawtext": [{"translate": "ui.revive_welcome", "with": {"rawtext": [{"selector": "@s"}]}}]}
tellraw @a {"rawtext": [{"translate": "chat.revive", "with": {"rawtext": [{"selector": "@s"}]}}]}

effect @a darkness 5

inputpermission set @s movement enabled
inputpermission set @s camera enabled

tp 0 100 0
effect @s slow_falling 20
give @s totem_of_undying 2
give @s ha:lucky_star
give @s ha:marble_apple
give @s ha:spawn_egg_fairy
effect @s resistance 1800 0

tag @s remove ban
tag @s remove muerto
tag @s remove inCinematic
tag @s remove intro
tag @s remove inIntro

function system/intro_message

particle ha:welcome_particle ~~~
particle ha:welcome_particle ~~1~
particle ha:welcome_particle ~~-1~