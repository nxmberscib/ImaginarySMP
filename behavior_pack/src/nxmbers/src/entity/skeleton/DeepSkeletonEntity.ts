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
    public MOB_ID: string = "cib:deep_skeleton";
    public displayName: string = "§bDeep Skeleton";

    public constructor() {
        system.afterEvents.scriptEventReceive.subscribe(
            this.onSonicBoomEvent.bind(this),
        );
        world.afterEvents.entitySpawn.subscribe(this.onShoot.bind(this));
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

    private onSonicBoomEvent(event: ScriptEventCommandMessageAfterEvent) {
        Imaginary.LOGGER.debug("hola xd");
        if (event.id != "cib:sonic_boom" || event?.message != "deep_skeleton") {
            return;
        }

        if (!event.sourceEntity) {
            return;
        }

        ShootSonicBoom(
            event.sourceEntity,
            event.sourceEntity.getHeadLocation(),
            event.sourceEntity.getViewDirection(),
            20,
            10,
        );
    }
}
