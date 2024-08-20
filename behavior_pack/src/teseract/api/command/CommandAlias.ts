export default function CommandAlias(alias: string): any {
    return function (constructor: any) {
        const aliases = alias.split("|").map((a) => a.trim());
        if (!constructor.__commandData) {
            public constructor.__commandData = {};
        }
        public constructor.__commandData["aliases"] = aliases.slice(1);
        public constructor.__commandData["name"] = aliases[0];
    };
}
