import { assertNever } from '../../Assert';
import { TriggerExporterCsv } from './Csv';
import { TriggerExporterJson } from './Json';
import { Exporter } from '../Base';
import { ExporterType } from '../Type';
import { Trigger } from '../../../types/Trigger';

export const policyExporterFactory = (type: ExporterType): Exporter<Trigger> => {
    switch (type) {
        case ExporterType.CSV:
            return new TriggerExporterCsv();
        case ExporterType.JSON:
            return new TriggerExporterJson();
    }

    assertNever(type);
};
