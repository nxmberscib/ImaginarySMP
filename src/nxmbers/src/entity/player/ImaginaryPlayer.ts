import WithLogger from "nxmbers/src/util/WithLogger";
import ResurrectionListener from "./listener/ResurrectionListener";

export default class ImaginaryPlayer extends WithLogger {
    public static registerPlayerBehaviors() {
        new ResurrectionListener();
        this.logger().info("Imaginary player loaded");
    }
}
