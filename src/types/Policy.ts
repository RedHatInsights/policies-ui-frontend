
export interface Policy {
    id: string;
    description?: string;
    isEnabled: boolean;
    name: string;
    conditions?: string;
    actions?: string;
}

