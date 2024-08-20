import {
    ItemComponentUseEvent,
    ItemCustomComponent,
    world,
} from "@minecraft/server";
import { Vector3Builder } from "../util/vector/VectorWrapper";
import WithLogger from "../util/WithLogger";
import Imaginary from "../Imaginary";

export default class ChipoteChillonItem implements ItemCustomComponent {
    public ITEM_ID = "cib:chipote_chillon";

    constructor() {
        world.beforeEvents.itemUse.subscribe(this.onUse.bind(this));
        Imaginary.LOGGER.robust("ChipoteChillon loaded");
    }

    public async onUse(event: ItemComponentUseEvent) {
        const { itemStack: item, source: player } = event;

        if (item?.typeId != this.ITEM_ID) {
            return;
        }

        await null;

        const cooldown = player.getItemCooldown("chipote");

        if (cooldown != 0) {
            return;
        }

        const spawnPos = new Vector3Builder(player.getHeadLocation());
        spawnPos.add(new Vector3Builder(player.getViewDirection()).normalize());

        const lego = player.dimension.spawnEntity(
            "cib:explosive_lego",
            spawnPos,
            {
                initialPersistence: true,
            },
        );

        const projectile = lego.getComponent("projectile");
        projectile.owner = player;
        projectile.shoot(
            new Vector3Builder(player.getViewDirection()).scale(4),
            {
                uncertainty: 0.0,
            },
        );

        player.startItemCooldown("chipote", 20 * 8);
    }
}
