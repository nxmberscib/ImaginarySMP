import {
    BlockTypes,
    EntityDamageCause,
    EntityDieAfterEvent,
    EntitySpawnAfterEvent,
    Player,
    ProjectileHitEntityAfterEvent,
    world,
} from "@minecraft/server";
import Imaginary from "../Imaginary";
import { MobNameRegistry } from "../manager/MobNameManager";
import ImaginaryEntities from "./ImaginaryEntities";

export default class BreezeEntity implements MobNameRegistry {
    public readonly MOB_ID: string = "minecraft:breeze";
    public readonly CHARGE_ID: string =
        "minecraft:breeze_wind_charge_projectile";
    public readonly displayName: string = "§aBreeze Mágico";

    public constructor() {
        world.afterEvents.projectileHitEntity.subscribe(
            this.onWindChargeHit.bind(this),
        );

        world.afterEvents.entitySpawn.subscribe(this.onSpawned.bind(this));
        world.afterEvents.entityDie.subscribe(this.onDeath.bind(this));

        Imaginary.getMobNameManager().addRegistry(this);
        Imaginary.LOGGER.robust("Breeze entity loaded");
    }

    private onDeath({ deadEntity: breeze }: EntityDieAfterEvent) {
        if (breeze?.typeId != this.MOB_ID) {
            return;
        }
        breeze.dimension.spawnEntity(
            ImaginaryEntities.DIABLOQUITO.MOB_ID,
            breeze.location,
        );
    }

    private onSpawned(event: EntitySpawnAfterEvent) {
        const { entity } = event;

        if (entity?.typeId != this.MOB_ID) {
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

            if (block?.typeId == "minecraft:air") {
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
