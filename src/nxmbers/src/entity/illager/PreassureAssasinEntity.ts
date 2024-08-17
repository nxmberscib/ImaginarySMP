import { EntityHurtAfterEvent, Player, world } from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";
import { MobNameRegistry } from "nxmbers/src/manager/MobNameManager";

export default class PreassureAssasinEntity implements MobNameRegistry {
    public readonly MOB_ID: string = "cib:preassure_assasin";
    
    constructor() {
        world.afterEvents.entityHurt.subscribe(this.onAttack.bind(this));
        Imaginary.getMobNameManager().addRegistry(this);
        Imaginary.LOGGER.robust(this.MOB_ID + " registered");
    }

    public mobId: string = this.MOB_ID;
    public displayName: string = "§cAsesino de Presión";

    private onAttack(event: EntityHurtAfterEvent) {
        const {
            damage,
            damageSource: { damagingEntity: damager },
            hurtEntity: player,
        } = event;
        if (damager?.typeId != "cib:preassure_assasin") {
            return;
        }

        if (!(player instanceof Player)) {
            return;
        }

        player.addEffect("blindness", 20 * 5);
    }
}
