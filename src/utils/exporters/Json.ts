import { Exporter } from './Base';
import { ExporterType } from './Type';

export abstract class ExporterJson<T> implements Exporter<T> {
    readonly type = ExporterType.JSON;

    public export(elements: Array<T>) {
        return new Blob([ JSON.stringify(elements) ], {
            type: 'application/json'
        });
    }

}
