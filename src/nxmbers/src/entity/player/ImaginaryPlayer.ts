import ResurrectionListener from "./listener/ResurrectionListener";

export default class ImaginaryPlayer {
    public static registerPlayerBehaviors() {
        new ResurrectionListener();
    } 
}