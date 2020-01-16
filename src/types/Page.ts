
const DEFAULT_PAGE_SIZE = 10;

export class Page {
    readonly index: number;
    readonly size: number;
    readonly sort?: Sort;

    private constructor(index: number, size?: number, sort?: Sort) {
        this.index = index;
        this.size = size || DEFAULT_PAGE_SIZE;
        this.sort = sort;
    }

    static of(index: number, size?: number, sort?: Sort) {
        return new Page(index, size, sort);
    }

    static defaultPage() {
        return new Page(1, DEFAULT_PAGE_SIZE);
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
