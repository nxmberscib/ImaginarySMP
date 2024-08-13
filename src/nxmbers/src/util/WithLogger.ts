import Imaginary from "../Imaginary";

export default class WithLogger {
    protected logger() {
        return Imaginary.logger();
    }
    protected static logger() {
        return Imaginary.logger();
    }
}
