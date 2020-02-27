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

export const usePolicyRows = (policies?: Policy[]): UsePolicyRowsReturn => {
    const [ policyRows, setPolicyRows ] = React.useState<PolicyRow[]>([]);

    React.useEffect(() => {
        if (policies) {
            setPolicyRows(policies?.map(policy => ({ ...policy, isOpen: false, isSelected: false })));
        }
    }, [ policies ]);

    const onCollapse = React.useCallback((policy: PolicyRow, index: number, isOpen: boolean) => {
        setPolicyRows(prevRows => {
            const newPolicyRows = [ ...prevRows ];
            newPolicyRows[index] = { ...policy, isOpen };
            return newPolicyRows;
        });
    }, [ setPolicyRows ]);

    const onSelect = React.useCallback((policy: PolicyRow, index: number, isSelected: boolean) => {
        setPolicyRows(prevRows => {
            const newPolicyRows = [ ...prevRows ];
            newPolicyRows[index] = { ...policy, isSelected };
            return newPolicyRows;
        });
    }, [ setPolicyRows ]);

    const onSelectionChanged = React.useCallback((command: SelectionCommand) => {
        if (command === SelectionCommand.NONE) {
            setPolicyRows(prevState => prevState.map(policy => ({ ...policy, isSelected: false })));
        } else if (command === SelectionCommand.PAGE) {
            setPolicyRows(prevState => prevState.map(policy => ({ ...policy, isSelected: true })));
        } else {
            assertNever(command);
        }
    }, [ setPolicyRows ]);

    const selectionCount = React.useMemo(() => policyRows.filter(policy => policy.isSelected).length, [ policyRows ]);

    return {
        rows: policyRows,
        onCollapse,
        onSelect,
        onSelectionChanged,
        selectionCount
    };
};
