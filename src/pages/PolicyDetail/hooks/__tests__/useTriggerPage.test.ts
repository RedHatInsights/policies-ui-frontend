import { renderHook } from '@testing-library/react-hooks';
import { useTriggerPage } from '../useTriggerPage';
import { Filter, Operator, Page } from '@redhat-cloud-services/insights-common-typescript';
import { TriggerFilterColumn } from '../../../../components/Trigger/Filters';

describe('src/pages/PolicyDetail/hooks/useTriggerPage', () => {
    it('Does not change the filter case', () => {
        const { result } = renderHook(() => {
            return useTriggerPage(10, undefined, {
                [TriggerFilterColumn.NAME]: 'FooBarBaz'
            });
        });

        expect(result.current.page).toEqual(
            Page.of(
                1,
                10,
                new Filter()
                .and('name', Operator.LIKE, 'FooBarBaz'),
                undefined
            )
        );
    });

    it('Trims the name and the id', () => {
        const { result } = renderHook(() => {
            return useTriggerPage(10, undefined, {
                [TriggerFilterColumn.NAME]: '   abc    '
            });
        });

        expect(result.current.page).toEqual(
            Page.of(
                1,
                10,
                new Filter()
                .and('name', Operator.LIKE, 'abc'),
                undefined
            )
        );
    });

    it('Does not include empty fields', () => {
        const { result } = renderHook(() => {
            return useTriggerPage(10, undefined, {
                [TriggerFilterColumn.NAME]: ''
            });
        });

        expect(result.current.page).toEqual(
            Page.of(
                1,
                10,
                new Filter(),
                undefined
            )
        );
    });
});
