import { ExporterType } from './Type';

export interface Exporter<T> {
    readonly type: ExporterType;
    export(elements: Array<T>): Blob;
}
