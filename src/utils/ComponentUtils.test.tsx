import * as React from 'react';
import { joinClasses, join } from './ComponentUtils';

describe('src/utils/ComponentUtils', () => {
    it('joinClasses joins multiple classes into one string', () => {
        expect(joinClasses('a', 'b', 'c')).toEqual('a b c');
    });

    it ('join joins multiple elements using other component as divider', () => {
        const Glue = () => {
            return null;
        };

        const result = join([
            <span key="foo"/>,
            <span key="bar"/>,
            <span key="baz"/>
        ], Glue);

        expect(result).toEqual([
            <span key="foo"/>,
            <Glue key="0_joined_element"/>,
            <span key="bar"/>,
            <Glue key="1_joined_element"/>,
            <span key="baz"/>
        ]);
    });
});
