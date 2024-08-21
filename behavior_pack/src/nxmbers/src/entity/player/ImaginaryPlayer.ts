import WithLogger from "nxmbers/src/util/WithLogger";
import ResurrectionListener from "./listener/ResurrectionListener";
import Imaginary from "nxmbers/src/Imaginary";
import ConnectionListener from "./listener/ConnectionListener";

export default class ImaginaryPlayer extends WithLogger {
    public static registerPlayerBehaviors() {
        new ResurrectionListener();
        new ConnectionListener();
        Imaginary.LOGGER.info("Imaginary player loaded");
    }
}
