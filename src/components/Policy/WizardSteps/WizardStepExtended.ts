import * as Yup from 'yup';

import { WizardStep } from '@patternfly/react-core';

export type WizardStepExtended = WizardStep & {
  validationSchema: Yup.Schema<unknown>;
};

export const AlwaysValid = Yup.object();
