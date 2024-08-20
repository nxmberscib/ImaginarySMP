import {
    EntitySpawnAfterEvent,
    ScriptEventCommandMessageAfterEvent,
    system,
    world,
} from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";
import { MobNameRegistry } from "nxmbers/src/manager/MobNameManager";
import ShootSonicBoom from "nxmbers/src/util/entity/ShootSonicBoom";
import TimerUtils from "teseract/api/util/TimerUtils";

export default class DeepSkeletonEntity implements MobNameRegistry {
    public readonly MOB_ID: string = "cib:deep_skeleton";
    public readonly displayName: string = "§bDeep Skeleton";

    public constructor() {
        world.afterEvents.entitySpawn.subscribe(this.onShoot.bind(this));
        Imaginary.getMobNameManager().addRegistry(this);
    }

    private async onShoot(event: EntitySpawnAfterEvent) {
        if (event.entity.typeId != "minecraft:arrow") {
            return;
        }

        const projectile = event.entity.getComponent("projectile");

        if (!projectile.owner || projectile.owner?.typeId != this.MOB_ID) {
            return;
        }

        const owner = projectile.owner;
        owner.dimension.playSound("mob.warden.sonic_charge", owner.location);

        event.entity.triggerEvent("from_deep_skeleton");

        await TimerUtils.sleep(40);

        const headLocation = owner.getHeadLocation();
        const direction = owner.getViewDirection();

        ShootSonicBoom(owner, headLocation, direction, 20, 10);
    }
}
