import MuteInformation from "./MuteInformation";

export default interface GlobalMuteInformation
    extends Partial<Record<string, MuteInformation | string | number>> {
    [key: string]: number | string;
    lastTimeChecked: number;
}
