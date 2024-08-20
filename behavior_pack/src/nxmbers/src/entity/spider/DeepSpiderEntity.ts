import { world, EntityHurtAfterEvent } from "@minecraft/server";
import { MobNameRegistry } from "nxmbers/src/manager/MobNameManager";
import TimerUtils from "teseract/api/util/TimerUtils";

export default class DeepSpiderEntity implements MobNameRegistry {
    public MOB_ID: string = "cib:deep_spider";
    public displayName: string = "§7Araña Profunda";

    public constructor() {
        world.afterEvents.entityHurt.subscribe(this.onExplode.bind(this));
    }

    private onExplode(event: EntityHurtAfterEvent) {
        const {
            hurtEntity,
            damageSource: { damagingEntity: deepCreeper },
        } = event;
        
        if (deepCreeper?.typeId != this.MOB_ID) {
            return;
        }

        hurtEntity.addEffect("fatal_poison", TimerUtils.fromSecondsToTicks(3), {amplifier:7});
    }
}
