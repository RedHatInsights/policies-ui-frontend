import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';

import { appWrapperCleanup, appWrapperSetup, getConfiguredAppWrapper } from '../../../../test/AppWrapper';
import { ErrorPage } from '../Page';

jest.mock('@redhat-cloud-services/frontend-components', () => {
    const actualFC = jest.requireActual('@redhat-cloud-services/frontend-components');
    const Children: React.FunctionComponent = (props) => {
        // eslint-disable-next-line testing-library/no-node-access
        return <span>{ props.children }</span>;
    };

    const Title: React.FunctionComponent<any> = (props) => {
        return <span>{ props.title }</span>;
    };

    return {
        ...actualFC,
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

    it('Goes back page when clicking the button', async () => {
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

        await userEvent.click(screen.getByRole('button', {
            name: /details/i
        }));
        expect(getLocation().pathname).toEqual('/');
    });
});
