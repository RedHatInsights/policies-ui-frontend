import { Exporter, ExporterType } from '@redhat-cloud-services/insights-common-typescript';
import { assertNever } from 'assert-never';

import { Trigger } from '../../../types/Trigger';
import { TriggerExporterCsv } from './Csv';
import { TriggerExporterJson } from './Json';

export const triggerExporterFactory = (type: ExporterType): Exporter<Trigger> => {
    switch (type) {
        case ExporterType.CSV:
            return new TriggerExporterCsv();
        case ExporterType.JSON:
            return new TriggerExporterJson();
    }

    assertNever(type);
};
