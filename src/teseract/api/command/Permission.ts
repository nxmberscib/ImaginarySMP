
export default function Permission(permission: number): any {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) {
        if (!target.__commandData) {
            target.__commandData = {};
        }
        if (descriptor) {
            if (!target.__commandData[propertyKey]) {
                target.__commandData[propertyKey] = {};
            }
            target.__commandData[propertyKey].permission = permission;
        } else {
            target.__commandData.permission = permission;
        }
    };
}