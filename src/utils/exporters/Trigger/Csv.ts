import { ExporterCsv, ExporterHeaders } from 'common-code-ui';
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
