import * as React from 'react';
import { PolicyRow } from '../components/Policy/Table/PolicyTable';
import { Policy } from '../types/Policy';
import { SelectionCommand } from '../components/Policy/TableToolbar/PolicyTableToolbar';
import { ImmutableContainerSetMode, ImmutableContainerSet, Page } from '@redhat-cloud-services/insights-common-typescript';
import { Uuid } from '../types/Policy/Policy';
import { usePrevious } from 'react-use';
import { useGetPoliciesIdsQuery } from '../services/useGetPoliciesIds';
import { assertNever } from 'assert-never';

export interface UsePolicyRowsReturn {
    rows: PolicyRow[];
    onCollapse: (policy: PolicyRow, index: number, isOpen: boolean) => void;
    onSelect: (policy: PolicyRow, index: number, isSelected: boolean) => void;
    onSelectionChanged: (command: SelectionCommand) => void;
    selectionCount: number;
    clearSelection: () =>  void;
    getSelected: () => Promise<Uuid[]>;
    loadingSelected: boolean;
    selected: ImmutableContainerSet<Uuid>;
    removeSelection: (policyId: Uuid) => void;
}

const selectedPoliciesEmpty = new ImmutableContainerSet<Uuid>(undefined, ImmutableContainerSetMode.INCLUDE);
const selectedPoliciesAll = new ImmutableContainerSet<Uuid>(undefined, ImmutableContainerSetMode.EXCLUDE);

export const usePolicyRows = (policies: Policy[] | undefined, loading: boolean, count: number, page: Page): UsePolicyRowsReturn => {
    const [ policyRows, setPolicyRows ] = React.useState<PolicyRow[]>([]);
    const [ selectedPolicies, setSelectedPolicies ] = React.useState<ImmutableContainerSet<Uuid>>(selectedPoliciesEmpty);
    const prevPolicies = usePrevious(policies);
    const { query, loading: loadingSelected } = useGetPoliciesIdsQuery();

    const clearSelection = React.useCallback(() => {
        setSelectedPolicies(selectedPoliciesEmpty);
        setPolicyRows(prev => prev.map(policy => ({ ...policy, isOpen: false, isSelected: false })));
    }, [ setSelectedPolicies ]);

    React.useEffect(() => {
        if (loading || !policies) {
            setPolicyRows([]);
        } else if (policies !== prevPolicies) {
            setPolicyRows(policies?.map(policy => ({ ...policy, isOpen: false, isSelected: selectedPolicies.contains(policy.id) })));
        }
    }, [ policies, loading, setPolicyRows, prevPolicies, selectedPolicies ]);

    const onCollapse = React.useCallback((policy: PolicyRow, index: number, isOpen: boolean) => {
        setPolicyRows(prevRows => {
            const newPolicyRows = [ ...prevRows ];
            newPolicyRows[index] = { ...policy, isOpen };
            return newPolicyRows;
        });
    }, [ setPolicyRows ]);

    const removeSelection = React.useCallback((policyId: Uuid) => {
        setSelectedPolicies(prevSelected => {
            return prevSelected.remove(policyId);
        });
    }, [ setSelectedPolicies ]);

    const onSelect = React.useCallback((policy: PolicyRow, index: number, isSelected: boolean) => {
        setSelectedPolicies(prevSelected => {
            return isSelected ? prevSelected.add(policy.id) : prevSelected.remove(policy.id);
        });
        setPolicyRows(prevRows => {
            const newPolicyRows = [ ...prevRows ];
            newPolicyRows[index] = { ...policy, isSelected };
            return newPolicyRows;
        });
    }, [ setSelectedPolicies ]);

    const onSelectionChanged = React.useCallback((command: SelectionCommand) => {
        if (command === SelectionCommand.NONE) {
            setSelectedPolicies(selectedPoliciesEmpty);
            setPolicyRows(prevState => prevState.map(policy => ({ ...policy, isSelected: false })));
        } else if (command === SelectionCommand.PAGE) {
            // Adds page into the current selection
            setSelectedPolicies(prev => prev.addIterable(policyRows.map(p => p.id)));
            setPolicyRows(prevState => prevState.map(policy => ({ ...policy, isSelected: true })));
        } else if (command === SelectionCommand.ALL) {
            setSelectedPolicies(selectedPoliciesAll);
            setPolicyRows(prevState => prevState.map(policy => ({ ...policy, isSelected: true })));
        } else {
            assertNever(command);
        }
    }, [ policyRows ]);

    const selectionCount = React.useMemo(() => selectedPolicies.size(count), [ selectedPolicies, count ]);

    const getSelected = React.useCallback(() => {
        if (selectedPolicies.mode === ImmutableContainerSetMode.INCLUDE) {
            return Promise.resolve(selectedPolicies.values());
        } else {
            return query(page).then(response => {
                if (response.error) {
                    throw response.errorObject;
                }

                let set: Set<Uuid> | Array<never> = [];
                if (response.payload?.status === 200) {
                    const tmpSet = new Set<Uuid>(response.payload.value);
                    selectedPolicies.values().forEach(id => {
                        tmpSet.delete(id);
                    });
                    set = tmpSet;
                }

                return Array.from(set.values());
            });
        }
    }, [ query, page, selectedPolicies ]);

    return {
        rows: policyRows,
        onCollapse,
        onSelect,
        onSelectionChanged,
        selectionCount,
        clearSelection,
        getSelected,
        loadingSelected,
        selected: selectedPolicies,
        removeSelection
    };
};
