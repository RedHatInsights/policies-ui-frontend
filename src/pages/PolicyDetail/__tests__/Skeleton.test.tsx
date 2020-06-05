import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { PolicyDetailSkeleton } from '../Skeleton';
import { AppWrapper, appWrapperCleanup, appWrapperSetup } from '../../../../test/AppWrapper';

describe('src/pages/PolicyDetail/Skeleton', () => {

    beforeEach(() => {
        appWrapperSetup();
    });

    afterEach(() => {
        appWrapperCleanup();
    });

    it('Renders breadcrumb policies with link to listPage', () => {
        render(<PolicyDetailSkeleton/>, {
            wrapper: AppWrapper
        });

        expect(screen.getByText(/Policies/i)).toHaveAttribute('href', '/list');
    });

    it('Renders Kebab button', () => {
        render(<PolicyDetailSkeleton/>, {
            wrapper: AppWrapper
        });

        expect(screen.getByRole('button')).toBeVisible();
    });

    it('Renders loading', () => {
        render(<PolicyDetailSkeleton/>, {
            wrapper: AppWrapper
        });

        expect(screen.getByText(/loading/i)).toBeVisible();
    });
});
