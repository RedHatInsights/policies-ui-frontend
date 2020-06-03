export enum ExporterType {
    JSON = 'json',
    CSV = 'csv'
}

export const exporterTypeFromString = (value: string): ExporterType => {
    const lowerCaseValue = value.toLowerCase();
    if (lowerCaseValue === ExporterType.CSV) {
        return ExporterType.CSV;
    } else if (lowerCaseValue === ExporterType.JSON) {
        return ExporterType.JSON;
    }

    throw new Error(`Invalid ExporterType requested [${value}]`);
};
