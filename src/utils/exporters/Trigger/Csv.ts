import { ExporterCsv, ExporterHeaders } from '../Csv';
import { Trigger } from '../../../types/Trigger';

export class TriggerExporterCsv extends ExporterCsv<Trigger> {

    public serialize(trigger: Trigger) {
        return { ...trigger };
    }

    public headers(): ExporterHeaders<TriggerExporterCsv, Trigger> {
        return [
            [ 'created', 'ctime' ],
            [ 'hostName', 'system' ],
            [ 'id', 'id' ]
        ];
    }
}
