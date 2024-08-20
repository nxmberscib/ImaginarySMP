import {
    Entity,
    EntityDamageCause,
    EntityDamageSource,
    EquipmentSlot,
    Player,
    World,
    world,
    WorldBeforeEvents,
} from "@minecraft/server";

interface CachedEntity {
    // name: string,
    nameTag: string;
    id: string;
    typeId: string;
}

const resurrectCallbacks = [];

const EntityCache: Map<string, CachedEntity> = new Map();

/**
 *
 * @param name
 * @returns
 */
function parseKillerName(name: string): string {
    if (name == undefined) {
        return undefined;
    }
    let parsedName = name
        .replace(/.+?(:)/g, "")
        .replace(/_/g, " ")
        .replace(/(?<= )./g, (char: string) => char.toUpperCase())
        .replace(/§./g, "")
        .replace(/(\n).+/, "")
        .replace(/ V2/g, (replaceValue: string) =>
            name == "minecraft:zombie_villager_v2" ? "" : replaceValue,
        );
    return parsedName[0].toUpperCase() + parsedName.substring(1);
}
world.afterEvents.entityHurt.subscribe((arg) => {
    try {
        const {
            hurtEntity: _player,
            damage: _damage,
            damageSource: _damageSource,
        } = arg;

        if (_damage > 0 || _damageSource.cause !== "none") {
            return;
        }

        const entityHurt = world.afterEvents.entityHurt;

        const data = entityHurt.subscribe((originalData) => {
            const { hurtEntity, damageSource, damage } = originalData;

            const player = hurtEntity as Player;

            let damagerWasValid = true;

            if (player.id != _player.id || damageSource.cause == "none") {
                return;
            }

            //@ts-ignore
            let damagingEntity =
                damageSource.cause == "entityExplosion"
                    ? EntityCache.get(damageSource.damagingEntity?.id)
                    : damageSource.damagingEntity;

            const killer =
                (damagingEntity?.nameTag == ""
                    ? (damagingEntity as Player)?.name
                    : damagingEntity?.nameTag) ??
                parseKillerName(damagingEntity?.typeId);

            const mimicProjectile = damageSource.damagingProjectile
                ? damageSource.damagingEntity.dimension.spawnEntity(
                      damageSource.damagingProjectile.typeId,
                      damageSource.damagingEntity.location,
                  )
                : undefined;

            const newCause =
                damageSource.cause != "projectile"
                    ? damageSource.cause
                    : mimicProjectile && damageSource.cause == "projectile"
                    ? EntityDamageCause.entityAttack
                    : EntityDamageCause.entityAttack;
            console.warn(mimicProjectile);
            const newDamageSource: EntityDamageSource = {
                cause: newCause,
                damagingEntity: damageSource.damagingEntity,
                damagingProjectile: mimicProjectile,
            };

            let cachedDamager;

            if (!damageSource.damagingEntity?.isValid()) {
                damagerWasValid = false;
                if (damageSource.cause == EntityDamageCause.entityExplosion) {
                    cachedDamager = EntityCache.get(
                        damageSource.damagingEntity.id,
                    );
                }
            }
            console.warn(damageSource.cause, EntityDamageCause.projectile);
            const eventData = new EntityResurrectEvent({
                hurtEntity: player,
                damage,
                damageSource: {
                    damagingEntity: damagerWasValid
                        ? damageSource.damagingEntity
                        : cachedDamager,
                    damagingProjectile: damageSource.damagingProjectile,
                    cause: damageSource.cause,
                },
            });

            world.afterEvents.entityHurt.unsubscribe(data);

            for (const callback of resurrectCallbacks) {
                callback(eventData);
            }

            if (!eventData.cancel) {
                if (mimicProjectile) {
                    mimicProjectile.remove();
                }
                return;
            }

            const equipment = player.getComponent("equippable");

            const mainHand = equipment.getEquipmentSlot(EquipmentSlot.Mainhand);
            const offHand = equipment.getEquipmentSlot(EquipmentSlot.Offhand);

            const mainItem = mainHand.getItem();
            const offItem = offHand.getItem();

            if (mainHand.getItem()?.typeId == "minecraft:totem_of_undying") {
                if (!world.gameRules.keepInventory) {
                    player.dimension.spawnItem(mainItem, player.location);
                }
                mainHand.setItem();
            }

            if (offHand.getItem()?.typeId == "minecraft:totem_of_undying") {
                if (!world.gameRules.keepInventory) {
                    player.dimension.spawnItem(offItem, player.location);
                }
                offHand.setItem();
            }

            if (!damagerWasValid && damageSource.damagingEntity != undefined) {
                const damager = player.dimension.spawnEntity(
                    cachedDamager.typeId,
                    player.location,
                );

                damager.addEffect("invisibility", 20000000);
                damager.nameTag = cachedDamager.nameTag;

                newDamageSource.damagingEntity = damager;
            }

            function forcePlayerDeath() {
                if (player.getComponent("health").currentValue > 0) {
                    player.applyDamage(99999, newDamageSource);
                    forcePlayerDeath();
                }
            }

            for (const effect of player.getEffects()) {
                player.removeEffect(effect.typeId);
            }

            forcePlayerDeath();

            if (!damagerWasValid && damageSource.damagingEntity != undefined) {
                newDamageSource.damagingEntity?.remove();
            }
            if (mimicProjectile) {
                mimicProjectile.remove();
            }
            if (world.gameRules.keepInventory) {
                mainHand.setItem(mainItem);
                offHand.setItem(offItem);
            }
        });
    } catch (error) {
        console.warn(error, error.stack);
    }
});

class EntityResurrectEvent {
    cancel: boolean = false;
    damage: number;
    constructor(data: {
        hurtEntity?: Entity;
        damage: any;
        damageSource: EntityDamageSource;
    }) {
        this.damage = data.damage;
        this.damageSource = data.damageSource;
        this.cancel = false;
        this.entity = data.hurtEntity;
    }
    entity: Entity;
    damageSource: EntityDamageSource;
}

declare module "@minecraft/server" {
    interface WorldBeforeEvents {
        entityResurrect: EntityResurrectEventSignal;
    }
}

class EntityResurrectEventSignal {
    static initialize() {
        //@ts-ignore
        const t = new this();
        WorldBeforeEvents.prototype.entityResurrect = t;
        world.beforeEvents.entityResurrect = t;
    }
    subscribe(callback: (event: EntityResurrectEvent) => void) {
        callback["id"] = Date.now().toString(16);
        resurrectCallbacks.push(callback);
    }
    unsubscribe(callback: (event: EntityResurrectEvent) => void) {
        resurrectCallbacks.splice(
            resurrectCallbacks.find((cal) => callback["id"] == cal["id"]),
        );
    }
}

const ResurrectEvent = new EntityResurrectEventSignal();

export { ResurrectEvent, EntityResurrectEventSignal, EntityResurrectEvent };
