import { join } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { format } from 'react-string-format';

export const useTextFormat = (text: string, dependencies: Array<string>, replaceNewLinesComponent: React.ElementType | undefined = 'br') => {
    return React.useMemo(() => {
        const replacement = format(text, ...dependencies);
        if (replaceNewLinesComponent) {
            return join(replacement.split('\n'), replaceNewLinesComponent);
        }

        return replacement as React.ReactNode;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ replaceNewLinesComponent, ...dependencies ]);
};
