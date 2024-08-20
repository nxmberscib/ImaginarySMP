import ResponsibleStaff from "../ResponsibleStaff";

export default interface MuteInformation {
    startTimestamp: number;
    shouldEndTimestamp: number;
    staff?: ResponsibleStaff;
    reason?: string;
    mutedId: string;
}
