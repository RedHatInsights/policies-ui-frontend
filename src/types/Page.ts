import { DeepReadonly } from 'ts-essentials';

const DEFAULT_PAGE_SIZE = 10;

export class Page {
    readonly index: number;
    readonly size: number;
    readonly filter?: Filter;
    readonly sort?: Sort;

    private constructor(index: number, size?: number, filter?: Filter, sort?: Sort) {
        this.index = index;
        this.size = size || DEFAULT_PAGE_SIZE;
        this.filter = filter;
        this.sort = sort;
    }

    static of(index: number, size?: number, filter?: Filter, sort?: Sort) {
        return new Page(index, size, filter, sort);
    }

    static defaultPage() {
        return new Page(1, DEFAULT_PAGE_SIZE);
    }

}

class FilterElement {
    readonly column: string;
    readonly operator: Operator;
    readonly value: string;

    public constructor(column: string, operator: Operator, value: string) {
        this.column = column;
        this.operator = operator;
        this.value = value;
    }
}

export class Filter {
    private _elements: FilterElement[];
    readonly elements: DeepReadonly<FilterElement[]>;

    public constructor() {
        this.elements = this._elements = [];
    }

    public and(column: string, operator: Operator, value: string) {
        this._elements.push(new FilterElement(column, operator, value));
        return this;
    }

}

export class Sort {
    readonly column: string;
    readonly direction: Direction;

    private constructor(column: string, direction: Direction) {
        this.column = column;
        this.direction = direction;
    }

    static by(column: string, direction: Direction) {
        return new Sort(column, direction);
    }
}

export enum Direction {
    ASCENDING = 'ASC',
    DESCENDING = 'DESC'
}

export enum Operator {
    EQUAL = 'EQUAL',
    LIKE = 'LIKE',
    ILIKE = 'ILIKE',
    NOT_EQUAL = 'NOT_EQUAL',
    BOOLEAN_IS = 'BOOLEAN_IS'
}

export type OnSortHandlerType = (index: number, column: string, direction: Direction) => void;
