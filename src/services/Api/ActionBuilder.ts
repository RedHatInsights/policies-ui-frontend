import { Action } from 'react-fetching-library';
import { Page } from '../../types/Page';
import camelcase from 'camelcase';

export type Method = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';
export interface HasToString {
    toString: () => string;
}

type HasToStringOrUndefined = HasToString | undefined;
export type QueryParamsType = Record<string, HasToStringOrUndefined>;

export class ActionBuilder {
    private readonly _method: Method;
    private readonly _url: string;
    private _queryParams?: QueryParamsType;
    private _data?: unknown;

    public constructor(method: Method, url: string) {
        this._method = method;
        this._url = url;
    }

    public queryParams(queryParams?: QueryParamsType) {
        this._queryParams = queryParams;
        return this;
    }

    public data(data?: unknown) {
        this._data = data;
        return this;
    }

    public build(): Action {
        const endpoint = this.getUrl() + this.buildQueryString();

        return {
            method: this.getMethod(),
            endpoint,
            body: this.getData()
        };
    }

    protected getMethod() {
        return this._method;
    }

    protected getUrl() {
        return this._url;
    }

    protected getQueryParams() {
        return this._queryParams;
    }

    protected getData() {
        return this._data;
    }

    protected buildQueryString() {
        const parsedURL = new URL(this.getUrl(), 'http://dummybase');
        const querySeparator = parsedURL.searchParams.toString() === '' ? '?' : '&';
        const queryString = this.getQueryParams() ? new URLSearchParams(this.stringParams(this.getQueryParams())).toString() : '';
        return queryString === '' ? '' : querySeparator + queryString;
    }

    private stringParams(params?: QueryParamsType): Record<string, string> {
        if (!params) {
            return {};
        }

        return Object.keys(params).reduce((prev, key) => {
            const value = params[key];
            if (value !== undefined) {
                prev[key] = value.toString();
            }

            return prev;
        }, {});
    }
}

export const actionBuilder = (method: Method, url: string): ActionBuilder => {
    return new ActionBuilder(method, url);
};

export const pageToQuery = (page?: Page): Record<string, HasToString> => {
    const queryParams = {} as Record<string, HasToString>;

    if (!page) {
        page = Page.defaultPage();
    }

    if (page.size === Page.NO_SIZE) {
        queryParams.offset = page.index;
        queryParams.limit = Page.NO_SIZE;
    } else {
        queryParams.offset = (page.index - 1) * page.size;
        queryParams.limit = page.size;
    }

    if (page.filter) {
        for (const filterElement of page.filter.elements) {
            queryParams[`filter${camelcase(filterElement.column, { pascalCase: true })}`] = filterElement.value;
            queryParams[`filterOp${camelcase(filterElement.column, { pascalCase: true })}`] = filterElement.operator;
        }
    }

    if (page.sort) {
        queryParams.sortColumn = page.sort.column;
        queryParams.sortDirection = page.sort.direction;
    }

    return queryParams;
};
