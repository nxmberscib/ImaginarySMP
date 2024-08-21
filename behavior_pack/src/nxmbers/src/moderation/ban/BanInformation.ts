import ResponsibleStaff from "../ResponsibleStaff";

export default interface BanInformation {
    startTimestamp: number;
    shouldEndTimestamp: number;
    staff?: ResponsibleStaff;
    reason?: string;
    bannedId: string;
}
