## Creado o Editado por: HaJuegosCat! y DiFox!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz
## Created or Edited by: HaJuegosCat!y DiFox!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz

execute as @a[hasitem={item=ha:lucky_star,quantity=!0}] at @s run tag @s add hasStar
execute as @a[hasitem={item=ha:lucky_star,quantity=0}] at @s run tag @s remove hasStar

execute as @e[hasitem={item=ha:regeneration_helmet,location=slot.armor.head}] at @s run effect @s health_boost 1 0 true
execute as @e[hasitem={item=ha:regeneration_helmet,location=slot.armor.head}] at @s run effect @s regeneration 1 0 true

execute as @a[tag=potionBad1] at @s run function effects_loops/bad_potion_one
execute as @a[tag=potionBad2] at @s run function effects_loops/bad_potion_two
execute as @a[tag=potionBad3] at @s run function effects_loops/bad_potion_three
execute as @a[tag=potionBad4] at @s run function effects_loops/bad_potion_four
execute as @a[tag=potionBad5] at @s run function effects_loops/bad_potion_five