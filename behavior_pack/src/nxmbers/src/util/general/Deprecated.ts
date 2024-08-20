import Logger from "teseract/api/Logger";

function Deprecated(target: any): any;
function Deprecated(
    target: any,
    key: string,
    descriptor: PropertyDescriptor,
): any;
function Deprecated(target: any, key: string): any;
function Deprecated(
    target: any,
    key?: string,
    descriptor?: PropertyDescriptor | undefined,
): any {
    const logger = new Logger("system");
    if (target.name && !key && !descriptor) {
        return logger.warn(`Class '${target.name}' is deprecated`);
    }
    if (!target.name && key && !descriptor) {
        return logger.warn(`Property '${key}' is deprecated`);
    }
    if (!target.name && key && descriptor) {
        return logger.warn(`Method '${key}' is deprecated`);
    }
}

export default Deprecated;
