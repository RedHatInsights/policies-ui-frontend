import { OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import { DeepPartial } from 'ts-essentials';

import { Action } from '../../../types/Policy/Actions';

export interface ActionFormProps extends OuiaComponentProps {
    action?: DeepPartial<Action>;
    prefix: string;
    isReadOnly?: boolean;
}
