import {
    ItemComponentUseEvent,
    ItemCustomComponent,
    world,
} from "@minecraft/server";
import WithLogger from "../util/WithLogger";
import { Vector3Builder } from "../util/vector/VectorWrapper";

export default class SlimeWandItem
    extends WithLogger
    implements ItemCustomComponent
{
    public ITEM_ID: string = "cib:slime_wand";

    constructor() {
        super();
        world.beforeEvents.itemUse.subscribe(this.onUse.bind(this));
        this.logger().robust("Slime wand item loaded");
    }

    public async onUse(event: ItemComponentUseEvent) {
        const { itemStack: item, source: player } = event;

        if (item?.typeId != this.ITEM_ID) {
            return;
        }

        await null;

        const cooldown = player.getItemCooldown("slime_wand");

        if (cooldown != 0) {
            return;
        }

        player.dimension.playSound("mace.heavy_smash_ground", player.location);

        for (const entity of player.dimension.getEntities({
            maxDistance: 5,
            families: ["monster", "hostile"],
        })) {
            entity.addEffect("poison", 20 * 10);
            entity.addEffect("slowness", 20 * 10);
        }

        player.startItemCooldown("chipote", 20 * 8);
    }
}
