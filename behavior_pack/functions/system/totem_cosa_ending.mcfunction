## Creado o Editado por: HaJuegosCat! y DiFox!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz
## Created or Edited by: HaJuegosCat!y DiFox!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz

playsound random.break

tellraw @s {"rawtext": [{"translate": "chat.stupid"}]}

scoreboard players reset * totalJumps

tag @s remove inJump
tag @s remove cooldownJump

event entity @e[type=ha:walter_npc] ha:no_drop