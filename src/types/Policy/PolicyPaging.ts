export enum PolicyFilterColumn {
    NAME = 'name',
    DESCRIPTION = 'description',
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

export interface PolicyFilterBase<Name, Description, Active> {
    [PolicyFilterColumn.NAME]: Name;
    [PolicyFilterColumn.DESCRIPTION]: Description;
    [PolicyFilterColumn.IS_ACTIVE]: Active;
}
type Setter<T> =  (val: T) => void;

export type PolicyFilters = PolicyFilterBase<string, string, IsActiveFilter>;
export type SetPolicyFilters = PolicyFilterBase<Setter<string>, Setter<string>, Setter<IsActiveFilter>>;

// Todo: Simplify this, we only need the FilterColumn
export type ClearFilterHandlerType = (commands: ClearFilterCommand[]) => void;
