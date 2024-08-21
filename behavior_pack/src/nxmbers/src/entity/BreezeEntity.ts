import {
    BlockTypes,
    EntityDamageCause,
    EntitySpawnAfterEvent,
    Player,
    ProjectileHitEntityAfterEvent,
    system,
    world,
} from "@minecraft/server";
import Imaginary from "../Imaginary";
import { MobNameRegistry } from "../manager/MobNameManager";

export default class BreezeEntity implements MobNameRegistry {
    public readonly MOB_ID: string = "minecraft:breeze";
    public CHARGE_ID: string = "minecraft:breeze_wind_charge_projectile";
    public readonly displayName: string = "§aBreeze Mágico";

    public constructor() {
        world.afterEvents.projectileHitEntity.subscribe(
            this.onWindChargeHit.bind(this),
        );
        world.afterEvents.entitySpawn.subscribe(this.onSpawned.bind(this));
        Imaginary.LOGGER.robust("Breeze entity loaded");
    }

    private onSpawned(event: EntitySpawnAfterEvent) {
        const { entity } = event;

        if (entity.typeId != this.MOB_ID) {
            return;
        }

        entity.addEffect("health_boost", 20000000, { amplifier: 7 });
        entity.getComponent("health").setCurrentValue(58);
    }

    private onWindChargeHit(event: ProjectileHitEntityAfterEvent) {
        try {
            const { projectile, source } = event;
            const player = event.getEntityHit().entity;

            if (
                !player ||
                !(player instanceof Player) ||
                projectile?.typeId != this.CHARGE_ID ||
                source?.typeId != this.MOB_ID
            ) {
                return;
            }

            const block = player.dimension.getBlock(player.location);

            if (block.typeId == "minecraft:air") {
                block.setType(BlockTypes.get("minecraft:web"));
            }

            player.addEffect("blindness", 20 * 3);
            player.addEffect("poison", 20 * 3);

            player.applyDamage(8, {
                damagingEntity: source,
                cause: EntityDamageCause.entityAttack,
            });
        } catch (error) {
            Imaginary.LOGGER.error(error);
        }
    }
}
