
const DEFAULT_PAGE_SIZE = 10;

export class Page {
    readonly index: number;
    readonly size: number;

    private constructor(index: number, size?: number) {
        this.index = index;
        this.size = size || DEFAULT_PAGE_SIZE;
    }

    static of(index: number, size?: number) {
        return new Page(index, size);
    }

    static defaultPage() {
        return new Page(1, DEFAULT_PAGE_SIZE);
    }

}
