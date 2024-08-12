import { system, world } from "@minecraft/server";
import Imaginary from "nxmbers/src/Imaginary";

export default class ObtainableItemsThread {
    public constructor() {
        system.runInterval(() => system.runJob(this.onRun()));
    }

    *onRun(): Generator<any, any, any> {
        try {
            Imaginary.logger().robust("ObtainableItemsThread executed");
        } catch (error) {
            Imaginary.logger().error(error);
        }
    }
}
