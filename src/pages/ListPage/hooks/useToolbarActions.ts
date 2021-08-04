import { addDangerNotification, exporterTypeFromString } from '@redhat-cloud-services/insights-common-typescript';
import { format } from 'date-fns';
import inBrowserDownload from 'in-browser-download';
import * as React from 'react';

import { UsePolicyRowsReturn } from '../../../hooks';
import { UsePolicyToDeleteResponse } from '../../../hooks/usePolicyToDelete';
import { useGetPoliciesQuery } from '../../../services/useGetPolicies';
import { useMassChangePolicyEnabledMutation } from '../../../services/useMassChangePolicyEnabled';
import { policyExporterFactory } from '../../../utils/exporters/Policy/Factory';
import { PolicyWizardState } from '../ListPage';

type Params = {
    setPolicyWizardState: (params: PolicyWizardState) => void;
    exportAllPoliciesQuery: ReturnType<typeof useGetPoliciesQuery>['query'];
    mutateChangePolicyEnabled: ReturnType<typeof useMassChangePolicyEnabledMutation>['mutate'];
    policyRows: UsePolicyRowsReturn;
    openPolicyToDelete: UsePolicyToDeleteResponse['open'];
};

export const useToolbarActions = (params: Params) => {

    const {
        setPolicyWizardState, exportAllPoliciesQuery, mutateChangePolicyEnabled, openPolicyToDelete
    } = params;

    const { selected, selectionCount, getSelected, rows } = params.policyRows;

    const createCustomPolicy = React.useCallback(() => {
        setPolicyWizardState({
            isOpen: true,
            showCreateStep: true,
            template: undefined,
            isEditing: false
        });
    }, [ setPolicyWizardState ]);

    const onDeletePolicies = React.useCallback(
        () => {
            if (selectionCount === 1) {
                const found = rows.find(p => selected.contains(p.id));
                if (found) {
                    openPolicyToDelete(found);
                    return;
                }
            }

            openPolicyToDelete(selectionCount);
        },
        [ selectionCount, openPolicyToDelete, selected, rows ]
    );

    const onDisablePolicies = React.useCallback(
        () => getSelected().then(ids => mutateChangePolicyEnabled({ shouldBeEnabled: false, policyIds: ids })),
        [ mutateChangePolicyEnabled, getSelected ]
    );

    const onEnablePolicies = React.useCallback(
        () => getSelected().then(ids => mutateChangePolicyEnabled({ shouldBeEnabled: true, policyIds: ids })),
        [ mutateChangePolicyEnabled, getSelected ]
    );

    const onExport = React.useCallback((_event, type) => {
        const exporter = policyExporterFactory(exporterTypeFromString(type));
        return exportAllPoliciesQuery().then(response => {
            if (response.payload?.type === 'PagedResponseOfPolicy') {
                inBrowserDownload(
                    exporter.export(response.payload.value.data),
                    `policies-${format(new Date(Date.now()), 'y-dd-MM')}.${exporter.type}`
                );
            } else {
                addDangerNotification('Couldn\'t download export', 'Reinitiate this export to try again.');
            }
        });
    }, [ exportAllPoliciesQuery ]);

    return {
        createCustomPolicy,
        onDeletePolicies,
        onDisablePolicies,
        onEnablePolicies,
        onExport
    };
};
