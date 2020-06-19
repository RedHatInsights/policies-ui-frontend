import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorPage } from '../Page';
import { getRouterWrapper } from '../../../../test/RouterWrapper';
import { linkTo } from '../../../Routes';

jest.mock('@redhat-cloud-services/frontend-components', () => {

    const Children: React.FunctionComponent = (props) => {
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
    });

    afterEach(() => {
        mockConsole.mockRestore();
    });

    it('Renders content when there is no error', () => {
        const { RouterWrapper } = getRouterWrapper('/');
        render(<ErrorPage>
            <div>hello world</div>
        </ErrorPage>, {
            wrapper: RouterWrapper
        });

        expect(screen.getByText('hello world')).toBeVisible();
    });

    it('Renders error screen when there is an error', () => {
        const { RouterWrapper } = getRouterWrapper('/');
        const Surprise = () => {
            throw new Error('surprise');
        };

        render(<ErrorPage>
            <Surprise/>
        </ErrorPage>, {
            wrapper: RouterWrapper
        });

        expect(screen.getByText(/Unhandled error/i)).toBeVisible();
    });

    it('Details are hidden', () => {
        const { RouterWrapper } = getRouterWrapper('/');
        const Surprise = () => {
            throw new Error('surprise');
        };

        render(<ErrorPage>
            <Surprise/>
        </ErrorPage>, {
            wrapper: RouterWrapper
        });

        expect(screen.getByText(/surprise/i)).not.toBeVisible();
    });

    it('Shows when show details is clicked', () => {
        const { RouterWrapper } = getRouterWrapper('/');
        const Surprise = () => {
            throw new Error('surprise');
        };

        render(<ErrorPage>
            <Surprise/>
        </ErrorPage>, {
            wrapper: RouterWrapper
        });

        userEvent.click(screen.getByText(/show details/i));
        expect(screen.getByText(/surprise/i)).toBeVisible();
    });

    it('Goes to list page when clicking the button', () => {
        const { RouterWrapper, data } = getRouterWrapper('/');
        const Surprise = () => {
            throw new Error('surprise');
        };

        render(<ErrorPage>
            <Surprise/>
        </ErrorPage>, {
            wrapper: RouterWrapper
        });

        userEvent.click(screen.getByRole('button', {
            name: /policy/i
        }));
        expect(data.location.pathname).toEqual(linkTo.listPage());
    });
});
