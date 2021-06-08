import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';

import { appWrapperCleanup, appWrapperSetup, getConfiguredAppWrapper } from '../../../../test/AppWrapper';
import { linkTo } from '../../../Routes';
import { ErrorPage } from '../Page';

jest.mock('@redhat-cloud-services/frontend-components', () => {

    const Children: React.FunctionComponent = (props) => {
        // eslint-disable-next-line testing-library/no-node-access
        return <span>{ props.children }</span>;
    };

    const Title: React.FunctionComponent<any> = (props) => {
        return <span>{ props.title }</span>;
    };

    return {
        Main: Children,
        PageHeader: Children,
        PageHeaderTitle: Title
    };
});

describe('src/pages/Error/Page', () => {

    let mockConsole;

    beforeEach(() => {
        mockConsole = jest.spyOn(console, 'error');
        mockConsole.mockImplementation(() => '');
        appWrapperSetup();
    });

    afterEach(() => {
        mockConsole.mockRestore();
        appWrapperCleanup();
    });

    it('Goes to list page when clicking the button', () => {
        const getLocation = jest.fn();
        const AppWrapper = getConfiguredAppWrapper({
            getLocation,
            route: {
                path: '/'
            }
        });

        const Surprise = () => {
            throw new Error('surprise');
        };

        render(<ErrorPage><Surprise /></ErrorPage>, {
            wrapper: AppWrapper
        });

        userEvent.click(screen.getByRole('button', {
            name: /policy/i
        }));
        expect(getLocation().pathname).toEqual(linkTo.listPage());
    });
});
