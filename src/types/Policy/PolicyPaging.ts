export enum PolicyFilterColumn {
    NAME = 'name',
    IS_ACTIVE = 'is_enabled'
}

export interface IsActiveFilter {
    enabled: boolean;
    disabled: boolean;
}

export interface ClearFilterCommand {
    filter: PolicyFilterColumn;
    data: unknown;
}

export interface PolicyFilterBase<Name, Active> {
    [PolicyFilterColumn.NAME]: Name;
    [PolicyFilterColumn.IS_ACTIVE]: Active;
}
type Setter<T> =  (val: T) => void;

export type PolicyFilters = PolicyFilterBase<string, IsActiveFilter>;
export type SetPolicyFilters = PolicyFilterBase<Setter<string>, Setter<IsActiveFilter>>;

// Todo: Simplify this, we only need the FilterColumn
export type ClearFilterHandlerType = (commands: ClearFilterCommand[]) => void;
