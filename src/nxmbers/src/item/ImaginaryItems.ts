import ChipoteChillon from "./ChipoteChillonItem";

export default class ImaginaryItems {
    static #CHIPOTE_CHILLON: ChipoteChillon;
    public static registerItems() {
        this.#CHIPOTE_CHILLON = new ChipoteChillon();
    }
}
