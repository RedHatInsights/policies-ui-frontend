
export enum ImmutableContainerSetMode {
    INCLUDE,
    EXCLUDE
}

export class ImmutableContainerSet<T> {

    public readonly mode: ImmutableContainerSetMode;
    private readonly set: Set<T>;

    public constructor(set?: Iterable<T>, mode?: ImmutableContainerSetMode) {
        this.mode = mode || ImmutableContainerSetMode.INCLUDE;
        this.set = new Set(set || []);
    }

    public static include<T>(included?: Iterable<T>) {
        return new ImmutableContainerSet<T>(included, ImmutableContainerSetMode.INCLUDE);
    }

    public static exclude<T>(excluded?: Iterable<T>) {
        return new ImmutableContainerSet<T>(excluded, ImmutableContainerSetMode.EXCLUDE);
    }

    public values(): T[] {
        return Array.from(this.set);
    }

    public add(value: T) {
        return this.update([ value ], this.mode === ImmutableContainerSetMode.INCLUDE);
    }

    public addIterable(values: Iterable<T>) {
        return this.update(values, this.mode === ImmutableContainerSetMode.INCLUDE);
    }

    public remove(value: T) {
        return this.update([ value ], this.mode === ImmutableContainerSetMode.EXCLUDE);
    }

    public removeIterable(values: Iterable<T>) {
        return this.update(values, this.mode === ImmutableContainerSetMode.EXCLUDE);
    }

    // Max is the maximum number of elements that could be contained at given time
    public size(max?: number) {
        if (this.mode === ImmutableContainerSetMode.INCLUDE) {
            return this.set.size;
        } else {
            if (max === undefined) {
                throw new Error('Requesting size of an ImmutableContainerSet with Mode:' + this.mode);
            }

            return max - this.set.size;
        }
    }

    public contains(value: T) {
        const inSet = this.set.has(value);
        return this.mode === ImmutableContainerSetMode.INCLUDE ? inSet : !inSet;
    }

    private update(values: Iterable<T>, addToSet: boolean) {
        const updated = new ImmutableContainerSet(this.set, this.mode);
        if (addToSet) {
            for (const value of values) {
                updated.set.add(value);
            }
        } else {
            for (const value of values) {
                updated.set.delete(value);
            }
        }

        return updated;
    }
}
