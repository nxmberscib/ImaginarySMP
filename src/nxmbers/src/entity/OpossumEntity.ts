import { EntityHurtAfterEvent, Player, world } from "@minecraft/server";
import { MobNameRegistry } from "../manager/MobNameManager";
import Imaginary from "../Imaginary";
import Runnable from "teseract/api/util/Runnable";

export default class OpossumEntity extends Runnable implements MobNameRegistry {
    public readonly MOB_ID: string = "cib:opossum";
    public readonly CLOUD_ID: string = "cib:opossum_cloud";
    public readonly displayName: string = "§7Sarigüeya";

    public constructor() {
        super();
        world.afterEvents.entityHurt.subscribe(this.onAttack.bind(this));
        Imaginary.getMobNameManager().addRegistry(this);
        Imaginary.LOGGER.robust("Opossum loaded");
        this.runTimer(1);
    }

    public override *onRunJob(): Generator<void, void, void> {}

    private onAttack(event: EntityHurtAfterEvent) {
        try {
            const {
                hurtEntity: player,
                damageSource: { damagingEntity: opossum },
            } = event;

            if (!(player instanceof Player) || opossum?.typeId != this.MOB_ID) {
                return;
            }

            const random = Math.random();

            switch (true) {
                case random < 0.3:
                    {
                        //subirse
                    }
                    break;
                case random > 0.3 && random < 0.6:
                    {
                        opossum.dimension.spawnEntity(
                            this.CLOUD_ID,
                            opossum.location,
                        );
                    }
                    break;
            }
        } catch (error) {
            Imaginary.LOGGER.error(error);
        }
    }
}
