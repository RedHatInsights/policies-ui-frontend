import { DeepPartial } from 'ts-essentials';
import { Action } from '../../../types/Policy/Actions';

export interface ActionFormProps {
    action?: DeepPartial<Action>;
    prefix: string;
    isReadOnly?: boolean;
}
