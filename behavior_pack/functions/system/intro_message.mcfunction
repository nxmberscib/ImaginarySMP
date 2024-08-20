## Creado o Editado por: HaJuegosCat! y DiFox!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz
## Created or Edited by: HaJuegosCat!y DiFox!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz

execute as @s[tag=!wachedIntro] at @s run inputpermission set @s movement enabled
execute as @s[tag=!wachedIntro] at @s run inputpermission set @s camera enabled

execute as @s[tag=!wachedIntro] at @s run gamemode s @s

execute as @s[tag=!wachedIntro] at @s run tellraw @a {"rawtext": [{"translate": "achievement.new_player", "with": {"rawtext": [{"selector": "@s"}]}}]}

titleraw @s title {"rawtext": [{"text": "§d§lIMAGINARY"}]}
titleraw @s subtitle {"rawtext": [{"translate": "ui.title_welcome"}]}

playsound ui.welcome_sound

execute as @s[tag=!wachedIntro] at @s run scoreboard players add "score.name.lives" totalLives 1

particle ha:welcome_particle ~~~
particle ha:welcome_particle ~~1~
particle ha:welcome_particle ~~-1~

execute as @s[tag=!wachedIntro] at @s run give @s totem_of_undying 2
execute as @s[tag=!wachedIntro] at @s run give @s ha:lucky_star
execute as @s[tag=!wachedIntro] at @s run give @s ha:marble_apple
execute as @s[tag=!wachedIntro] at @s run give @s ha:spawn_egg_fairy
execute as @s[tag=!wachedIntro] at @s run effect @s resistance 1800 0

tag @s add intro
tag @s add wachedIntro
tag @s remove inIntro