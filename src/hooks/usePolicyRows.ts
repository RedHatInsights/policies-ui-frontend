import * as React from 'react';
import { PolicyRow } from '../components/Policy/Table/PolicyTable';
import { Policy } from '../types/Policy';
import { SelectionCommand } from '../components/Policy/TableToolbar/PolicyTableToolbar';
import { assertNever } from '../utils/Assert';
import { Uuid } from '../types/Policy/Policy';
import { usePrevious } from 'react-use';

export interface UsePolicyRowsReturn {
    rows: PolicyRow[];
    onCollapse: (policy: PolicyRow, index: number, isOpen: boolean) => void;
    onSelect: (policy: PolicyRow, index: number, isSelected: boolean) => void;
    onSelectionChanged: (command: SelectionCommand) => void;
    selectionCount: number;
    clearSelection: () =>  void;
}

enum ImmutablePolicySetMode {
    INCLUDE,
    EXCLUDE
}

class ImmutablePolicySelectionSet {
    public readonly mode: ImmutablePolicySetMode;
    private readonly set: Set<Uuid>;

    public constructor(mode: ImmutablePolicySetMode, set?: Set<Uuid>) {
        this.mode = mode;
        this.set = new Set(set || []);
    }

    public add(policyIds: Uuid[]) {
        return this.update(policyIds, this.mode === ImmutablePolicySetMode.INCLUDE);
    }

    public remove(policyIds: Uuid[]) {
        return this.update(policyIds, this.mode === ImmutablePolicySetMode.EXCLUDE);
    }

    // Max is the maximum number of elements that could be selected at given time
    public size(max: number) {
        if (this.mode === ImmutablePolicySetMode.INCLUDE) {
            return this.set.size;
        } else {
            return max - this.set.size;
        }
    }

    public isSelected(policyId: Uuid) {
        const inSet = this.set.has(policyId);
        return this.mode === ImmutablePolicySetMode.INCLUDE ? inSet : !inSet;
    }

    private update(policyIds: Uuid[], addToSet: boolean) {
        const updated = new ImmutablePolicySelectionSet(this.mode, this.set);
        if (addToSet) {
            policyIds.forEach(pid => updated.set.add(pid));
        } else {
            policyIds.forEach(pid => updated.set.delete(pid));
        }

        return updated;
    }
}

const selectedPoliciesEmpty = new ImmutablePolicySelectionSet(ImmutablePolicySetMode.INCLUDE);

const selectedPoliciesAll = new ImmutablePolicySelectionSet(ImmutablePolicySetMode.EXCLUDE);

export const usePolicyRows = (policies: Policy[] | undefined, loading: boolean, count: number): UsePolicyRowsReturn => {
    const [ policyRows, setPolicyRows ] = React.useState<PolicyRow[]>([]);
    const [ selectedPolicies, setSelectedPolicies ] = React.useState<ImmutablePolicySelectionSet>(selectedPoliciesEmpty);
    const prevPolicies = usePrevious(policies);

    const clearSelection = React.useCallback(() => {
        setSelectedPolicies(selectedPoliciesEmpty);
    }, [ setSelectedPolicies ]);

    React.useEffect(() => {
        if (loading || !policies) {
            setPolicyRows([]);
        } else if (policies !== prevPolicies) {
            setPolicyRows(policies?.map(policy => ({ ...policy, isOpen: false, isSelected: selectedPolicies.isSelected(policy.id) })));
        }
    }, [ policies, loading, setPolicyRows, prevPolicies, selectedPolicies ]);

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
            return isSelected ? prevSelected.add(policies) : prevSelected.remove(policies);
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
            setSelectedPolicies(prev => prev.add(policyRows.map(p => p.id)));
            setPolicyRows(prevState => prevState.map(policy => ({ ...policy, isSelected: true })));
        } else if (command === SelectionCommand.ALL) {
            setSelectedPolicies(selectedPoliciesAll);
            setPolicyRows(prevState => prevState.map(policy => ({ ...policy, isSelected: true })));
        } else {
            assertNever(command);
        }
    }, [ policyRows ]);

    const selectionCount = React.useMemo(() => selectedPolicies.size(count), [ selectedPolicies, count ]);

    return {
        rows: policyRows,
        onCollapse,
        onSelect,
        onSelectionChanged,
        selectionCount,
        clearSelection
    };
};
