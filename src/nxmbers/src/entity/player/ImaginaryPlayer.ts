import WithLogger from "nxmbers/src/util/WithLogger";
import ResurrectionListener from "./listener/ResurrectionListener";
import Imaginary from "nxmbers/src/Imaginary";

export default class ImaginaryPlayer extends WithLogger {
    public static registerPlayerBehaviors() {
        new ResurrectionListener();
        Imaginary.LOGGER.info("Imaginary player loaded");
    }
}
