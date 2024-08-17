import Imaginary from "../Imaginary";
import Deprecated from "./general/Deprecated";

@Deprecated
export default class WithLogger {
    @Deprecated
    protected get LOGGER() {
        return Imaginary.LOGGER;
    }
    @Deprecated
    protected logger() {
        return Imaginary.LOGGER;
    }
    @Deprecated
    protected static logger() {
        return Imaginary.LOGGER;
    }
}
