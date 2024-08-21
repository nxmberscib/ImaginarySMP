import { world } from "@minecraft/server";
import Runnable from "teseract/api/util/Runnable";

export default class LeavesBlock extends Runnable {
    public constructor() {
        super();
        this.runTimer(5);
    }

    public override *onRunJob(...args: any[]): Generator<void, void, void> {
        for (const player of world.getAllPlayers()) {
            const location = player.location;
            location.y -= 0.7;
            const block = player.dimension.getBlock(location);
            if (block.typeId.includes("leaves")) {
                const { x, y, z } = block.location;
                player.runCommand(
                    `execute positioned ${x.toFixed(0)} ${y.toFixed(
                        0,
                    )} ${z.toFixed(0)} run fill ~ ~ ~ ~ ~ ~ air destroy`,
                );
                yield;
            }
            yield;
        }
    }
}
