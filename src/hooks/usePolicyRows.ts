import * as React from 'react';
import { PolicyRow } from '../components/Policy/Table/PolicyTable';
import { Policy } from '../types/Policy';
import { SelectionCommand } from '../components/Policy/TableToolbar/PolicyTableToolbar';
import { assertNever } from '../utils/Assert';

export interface UsePolicyRowsReturn {
    rows: PolicyRow[];
    onCollapse: (policy: PolicyRow, index: number, isOpen: boolean) => void;
    onSelect: (policy: PolicyRow, index: number, isSelected: boolean) => void;
    onSelectionChanged: (command: SelectionCommand) => void;
    selectionCount: number;
}

interface SelectedPolicies {
    included: boolean;
    policies: Set<string>;
}

const updateSelection = (selectedPolicies: SelectedPolicies, policies: string[], shouldAdd: boolean) => {
    const result: SelectedPolicies = {
        included: selectedPolicies.included,
        policies: new Set(selectedPolicies.policies)
    };

    if (shouldAdd) {
        policies.forEach(p => result.policies.add(p));
    } else {
        policies.forEach(p => result.policies.delete(p));
    }

    return result;
};

const addSelection = (selectedPolicies: SelectedPolicies, policies: string[]) => {
    return updateSelection(selectedPolicies, policies, selectedPolicies.included);
};

const removeSelection = (selectedPolicies: SelectedPolicies, policies: string[]) => {
    return updateSelection(selectedPolicies, policies, !selectedPolicies.included);
};

const isSelected = (policy: Policy, selectedPolicies: SelectedPolicies) => {
    const included = selectedPolicies.policies.has(policy.id);
    return selectedPolicies.included ? included : !included;
    return included && selectedPolicies.included;
};

const selectedPoliciesEmpty: SelectedPolicies = {
    included: true,
    policies: new Set()
};

const selectedPoliciesAll: SelectedPolicies = {
    included: false,
    policies: new Set()
};

export const usePolicyRows = (policies: Policy[] | undefined, loading: boolean, count: number): UsePolicyRowsReturn => {
    const [ policyRows, setPolicyRows ] = React.useState<PolicyRow[]>([]);
    const [ selectedPolicies, setSelectedPolicies ] = React.useState<SelectedPolicies>(selectedPoliciesEmpty);

    React.useEffect(() => {
        if (loading || !policies) {
            setPolicyRows([]);
        } else if (policies) {
            setPolicyRows(policies?.map(policy => ({ ...policy, isOpen: false, isSelected: isSelected(policy, selectedPolicies) })));
        }
    }, [ policies, loading, selectedPolicies ]);

    const onCollapse = React.useCallback((policy: PolicyRow, index: number, isOpen: boolean) => {
        setPolicyRows(prevRows => {
            const newPolicyRows = [ ...prevRows ];
            newPolicyRows[index] = { ...policy, isOpen };
            return newPolicyRows;
        });
    }, [ setPolicyRows ]);

    const onSelect = React.useCallback((policy: PolicyRow, index: number, isSelected: boolean) => {
        setSelectedPolicies(prevSelected => {
            const policies = [ policy.id ];
            return isSelected ? addSelection(prevSelected, policies) : removeSelection(prevSelected, policies);
        });
    }, [ setSelectedPolicies ]);

    const onSelectionChanged = React.useCallback((command: SelectionCommand) => {
        if (command === SelectionCommand.NONE) {
            setSelectedPolicies(selectedPoliciesEmpty);
        } else if (command === SelectionCommand.PAGE) {
            // Adds page into the current selection
            setSelectedPolicies(prev => addSelection(prev, policyRows.map(p => p.id)));
        } else if (command === SelectionCommand.ALL) {
            setSelectedPolicies(selectedPoliciesAll);
        } else {
            assertNever(command);
        }
    }, [ policyRows ]);

    const selectionCount = React.useMemo(() => {
        if (selectedPolicies.included) {
            return selectedPolicies.policies.size;
        } else {
            return count - selectedPolicies.policies.size;
        }
    }, [ selectedPolicies, count ]);

    return {
        rows: policyRows,
        onCollapse,
        onSelect,
        onSelectionChanged,
        selectionCount
    };
};
