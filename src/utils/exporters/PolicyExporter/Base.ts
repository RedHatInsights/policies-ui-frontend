import { Policy } from '../../../types/Policy';
import { PolicyExporterType } from './Type';

export interface PolicyExporter {
    type: PolicyExporterType;
    export: (policies: Policy[]) => Blob;
}

