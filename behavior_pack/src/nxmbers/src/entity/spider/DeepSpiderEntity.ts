import {
    world,
    EntityHurtAfterEvent,
    BlockVolumeBase,
    BlockVolume,
} from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";
import { MobNameRegistry } from "nxmbers/src/manager/MobNameManager";
import { Vector3Builder } from "nxmbers/src/util/vector/VectorWrapper";
import TimerUtils from "teseract/api/util/TimerUtils";

export default class DeepSpiderEntity implements MobNameRegistry {
    public readonly MOB_ID: string = "cib:deep_spider";
    public readonly displayName: string = "§7Araña Profunda";

    public constructor() {
        world.afterEvents.entityHurt.subscribe(this.onExplode.bind(this));
        Imaginary.getMobNameManager().addRegistry(this);
    }

    private onExplode(event: EntityHurtAfterEvent) {
        const {
            hurtEntity,
            damageSource: { damagingEntity: deepSpider },
        } = event;

        if (deepSpider?.typeId != this.MOB_ID) {
            return;
        }

        hurtEntity.addEffect("fatal_poison", TimerUtils.fromSecondsToTicks(3), {
            amplifier: 7,
        });

        if (Math.random() < 0.5) {
            const location = new Vector3Builder(hurtEntity.location);
            hurtEntity.dimension.fillBlocks(
                new BlockVolume(
                    location.clone().add(new Vector3Builder(-1, 0, -1)),
                    location.clone().add(new Vector3Builder(1, 0, 1)),
                ),
                "minecraft:web",
            );
        }
    }
}
