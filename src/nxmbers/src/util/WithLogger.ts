import Imaginary from "../Imaginary";

export default class WithLogger {
    protected logger() {
        return Imaginary.logger();
    }
}
