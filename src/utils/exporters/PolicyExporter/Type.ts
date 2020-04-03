export enum PolicyExporterType {
    JSON = 'json',
    CSV = 'csv'
}

export const policyExporterTypeFromString = (value: string): PolicyExporterType => {
    const lowerCaseValue = value.toLowerCase();
    if (lowerCaseValue === PolicyExporterType.CSV) {
        return PolicyExporterType.CSV;
    } else if (lowerCaseValue === PolicyExporterType.JSON) {
        return PolicyExporterType.JSON;
    }

    throw new Error(`Invalid PolicyExporterType requested [${value}]`);
};
