import {
    EntityHurtAfterEvent,
    ExplosionBeforeEvent,
    world,
} from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";
import { MobNameRegistry } from "nxmbers/src/manager/MobNameManager";
import TimerUtils from "teseract/api/util/TimerUtils";

export default class DeepCreeperEntity implements MobNameRegistry {
    public readonly MOB_ID: string = "cib:deep_creeper";
    public readonly displayName: string = "§dCreeper Profundo";

    public constructor() {
        world.afterEvents.entityHurt.subscribe(this.onExplode.bind(this));
        Imaginary.getMobNameManager().addRegistry(this);
        Imaginary.LOGGER.robust("Deep creeper entity loaded");
    }

    private onExplode(event: EntityHurtAfterEvent) {
        const {
            hurtEntity,
            damageSource: { damagingEntity: deepCreeper },
        } = event;
        if (deepCreeper?.typeId != this.MOB_ID) {
            return;
        }
        hurtEntity.addEffect("blindness", TimerUtils.fromSecondsToTicks(6));
        hurtEntity.addEffect(
            "mining_fatigue",
            TimerUtils.fromSecondsToTicks(6),
            { amplifier: 3 },
        );
    }
}
