## Creado o Editado por: HaJuegosCat! y DiFox!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz
## Created or Edited by: HaJuegosCat!y DiFox!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz
## Deprecated.
summon creeper ~~~ 0 0 ha:totem_creeper

execute as @s[tag=limitedTotem] at @s run scoreboard players add @s totalTotems 1

execute as @s[tag=!limitedTotem] at @s run tellraw @a {"rawtext": [{"translate": "chat.used_totem", "with": {"rawtext": [{"selector": "@s"}]}}]}
execute as @s[tag=limitedTotem] at @s run tellraw @a {"rawtext": [{"translate": "chat.used_totem_limited", "with": {"rawtext": [{"selector": "@s"}, {"score":{"name": "@s","objective": "totalTotems"}}]}}]}


execute as @s[tag=!oneTotem] at @s run tellraw @a {"rawtext": [{"translate": "chat.one_totem", "with": {"rawtext": [{"selector": "@s"}]}}]}
execute as @s[tag=!oneTotem] at @s run tag @s add oneTotem

execute as @s[scores={totalTotems=15..}] at @s run kill