## Creado o Editado por: HaJuegosCat! y DiFox!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz
## Created or Edited by: HaJuegosCat!y DiFox!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz

tag @s remove inJump
tag @s remove cooldownJump

playsound random.click @a ~ ~ ~ 900 2

tellraw @s {"rawtext": [{"translate": "chat.jumonow", "with": {"rawtext": [{"score": {"name":"*","objective":"totalJumps"}}]}}]}

tag @s add inJump

scoreboard players remove @s totalJumps 1