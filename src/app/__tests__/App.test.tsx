import * as React from 'react';
import { render, screen, act } from '@testing-library/react';
import App from '../App';
import { AppWrapper, appWrapperSetup, appWrapperCleanup } from '../../../test/AppWrapper';
import * as RbacUtils from '../../utils/RbacUtils';
import { Rbac } from '../../types/Rbac';

jest.mock('../../utils/RbacUtils');
jest.mock('../../services/useUserSettingsEmailQuery');
jest.mock('../../Routes', () => {
    const MockedRoutes: React.FunctionComponent = () => <div data-testid="content"/>;
    return {
        Routes: MockedRoutes
    };
});
jest.mock('../../components/AppSkeleton/AppSkeleton', () => {
    const RealAppSkeleton = jest.requireActual('../../components/AppSkeleton/AppSkeleton').AppSkeleton;
    const MockedAppSkeleton: React.FunctionComponent = () => <div data-testid="loading"><RealAppSkeleton/></div>;
    return {
        AppSkeleton: MockedAppSkeleton
    };
});

describe('src/app/App', () => {

    beforeEach(() => {
        appWrapperSetup();
    });

    afterEach(() => {
        appWrapperCleanup();
    });

    it('Shows loading when RBAC is not set', async () => {
        jest.useFakeTimers();
        const promise = new Promise<Rbac>(() => {});
        jest.spyOn(RbacUtils, 'fetchRBAC').mockImplementation(() => promise);
        render(
            <App/>,
            {
                wrapper: AppWrapper
            }
        );

        await act(async () => {
            await jest.advanceTimersToNextTimer();
        });

        expect(screen.getByTestId('loading')).toBeTruthy();
        jest.restoreAllMocks();
    });

    it('Shows the content when RBAC.canReadAll is set', async () => {
        jest.useFakeTimers();
        jest.spyOn(RbacUtils, 'fetchRBAC').mockImplementation(() => Promise.resolve({
            canReadAll: true,
            canWriteAll: true
        }));
        render(
            <App/>,
            {
                wrapper: AppWrapper
            }
        );

        await act(async () => {
            await jest.advanceTimersToNextTimer();
        });

        expect(screen.getByTestId('content')).toBeTruthy();
    });

    it('Shows error when RBAC does not have read access', async () => {
        jest.useFakeTimers();
        jest.spyOn(RbacUtils, 'fetchRBAC').mockImplementation(() => Promise.resolve({
            canReadAll: false,
            canWriteAll: true
        }));
        render(
            <App/>,
            {
                wrapper: AppWrapper
            }
        );

        await act(async () => {
            await jest.advanceTimersToNextTimer();
        });

        expect(screen.getByText(/You do not have access to Policies/i)).toBeTruthy();
    });
});
