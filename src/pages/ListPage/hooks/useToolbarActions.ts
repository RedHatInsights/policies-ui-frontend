import * as React from 'react';
import inBrowserDownload from 'in-browser-download';
import { format } from 'date-fns';
import { addDangerNotification } from '../../../utils/AlertUtils';
import { PolicyWizardState } from '../ListPage';
import { Policy } from '../../../types/Policy';
import { UsePaginatedQueryResponse, UsePolicyRowsReturn } from '../../../hooks';
import { useMassChangePolicyEnabledMutation } from '../../../services/useMassChangePolicyEnabled';
import { UsePolicyToDeleteResponse } from '../../../hooks/usePolicyToDelete';
import { policyExporterFactory } from '../../../utils/exporters/Policy/Factory';
import { exporterTypeFromString } from '../../../utils/exporters/Type';

type Params = {
    setPolicyWizardState: (params: PolicyWizardState) => void;
    exportAllPoliciesQuery: UsePaginatedQueryResponse<Policy[]>['query'];
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
            if (response.payload) {
                inBrowserDownload(
                    exporter.export(response.payload),
                    `policies-${format(new Date(Date.now()), 'y-dd-MM')}.${exporter.type}`
                );
            } else {
                addDangerNotification('Unable to download policies', 'We were unable to download the policies for exporting');
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
