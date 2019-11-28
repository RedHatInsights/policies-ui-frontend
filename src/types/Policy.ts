
export interface Policy {
    id?: string;
    actions?: string;
    conditions: string;
    customerid: string;
    description?: string;
    isEnabled?: boolean;
    name: string;
}
