import ChipoteChillonItem from "./ChipoteChillonItem";

export default class ImaginaryItems {
    public static CHIPOTE_CHILLON: ChipoteChillonItem;

    public static registerItems() {
        this.CHIPOTE_CHILLON = new ChipoteChillonItem();
    }
}
