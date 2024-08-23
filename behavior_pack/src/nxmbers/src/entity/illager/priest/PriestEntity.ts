import {
    EntityHurtAfterEvent,
    EntitySpawnAfterEvent,
    Player,
    world,
    WorldAfterEvents,
} from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";
import { MobNameRegistry } from "nxmbers/src/manager/MobNameManager";
import { VECTOR3_DOWN } from "nxmbers/src/util/vector/CoreHelpers";
import { Vector3Builder } from "nxmbers/src/util/vector/VectorWrapper";
import TimerUtils from "teseract/api/util/TimerUtils";

export default class PreassureAssasinEntity implements MobNameRegistry {
    public readonly MOB_ID: string = "cib:priest";
    public readonly CHARGE_ID: string = "cib:gold_charge";
    public readonly CATALYST_ID: string = "cib:gold_charge_catalyst";
    public readonly displayName: string = "§gSacerdote";

    public constructor() {
        world.afterEvents.entitySpawn.subscribe(
            this.onCatalystSpawned.bind(this),
        );
        world.afterEvents.projectileHitBlock.subscribe(
            async ({ projectile }) => {
                if (
                    projectile.typeId == this.CHARGE_ID &&
                    projectile.isValid()
                ) {
                    await TimerUtils.sleep(1);
                    projectile.remove();
                }
            },
        );

        world.afterEvents.projectileHitEntity.subscribe(
            async ({ projectile }) => {
                if (
                    projectile.typeId == this.CHARGE_ID &&
                    projectile.isValid()
                ) {
                    await TimerUtils.sleep(1);
                    projectile.remove();
                }
            },
        );
        Imaginary.getMobNameManager().addRegistry(this);
        Imaginary.LOGGER.robust(this.MOB_ID + " registered");
    }

    private async onCatalystSpawned({ entity }: EntitySpawnAfterEvent) {
        if (entity?.typeId != this.CATALYST_ID || !entity.isValid()) {
            return;
        }

        for (let x = 0; x <= 20; x++) {
            const max = 5,
                min = -5;
            const charge = entity.dimension.spawnEntity(
                this.CHARGE_ID,
                new Vector3Builder(entity.location).add(
                    new Vector3Builder(
                        Math.random() * (max - min) + min,
                        10,
                        Math.random() * (max - min) + min,
                    ),
                ),
            );
            entity.dimension.playSound(
                "mob.ghast.fireball",
                new Vector3Builder(entity.location).add(
                    new Vector3Builder(
                        Math.random() * (max - min) + min,
                        10,
                        Math.random() * (max - min) + min,
                    ),
                ),
            );
            charge
                .getComponent("projectile")
                .shoot(new Vector3Builder(VECTOR3_DOWN).scale(2));
            await TimerUtils.sleep(1);
        }
        entity.triggerEvent("despawn");
    }
}
