
export type FactType = 'BOOLEAN' | 'INT' | 'STRING';

export interface Fact {
    id: number;
    name: string;
    type: FactType;
}
