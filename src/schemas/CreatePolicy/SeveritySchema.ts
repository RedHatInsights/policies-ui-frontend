import * as Yup from 'yup';
import { Severity } from '../../types/Policy';

export const SeveritySchema = Yup.string().oneOf(Object.values(Severity));
