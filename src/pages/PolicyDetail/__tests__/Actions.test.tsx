import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';

import { PolicyDetailActions } from '../Actions';

describe('src/pages/PolicyDetail/Actions', () => {
    it('Renders menu', () => {
        render(<PolicyDetailActions
            edit={ jest.fn() }
            duplicate={ jest.fn() }
            delete={ jest.fn() }
            changeEnabled={ jest.fn() }
            disabled={ false }
            isEnabled={ true }
            loadingEnabledChange={ false }
        />);

        expect(screen.getByRole('button')).toBeVisible();
    });

    it('Shows menu with disable when isEnabled is true', async () => {
        render(<PolicyDetailActions
            edit={ jest.fn() }
            duplicate={ jest.fn() }
            delete={ jest.fn() }
            changeEnabled={ jest.fn() }
            disabled={ false }
            isEnabled={ true }
            loadingEnabledChange={ false }
        />);

        await userEvent.click(screen.getByRole('button'));

        expect(screen.queryByText(/enable/i)).not.toBeInTheDocument();
        expect(screen.getByText(/disable/i)).toBeVisible();
        expect(screen.getByText(/edit/i)).toBeVisible();
        expect(screen.getByText(/duplicate/i)).toBeVisible();
        expect(screen.getByText(/remove/i)).toBeVisible();
    });

    it('Shows menu with enable when isEnabled is false', async() => {
        render(<PolicyDetailActions
            edit={ jest.fn() }
            duplicate={ jest.fn() }
            delete={ jest.fn() }
            changeEnabled={ jest.fn() }
            disabled={ false }
            isEnabled={ false }
            loadingEnabledChange={ false }
        />);

        await userEvent.click(screen.getByRole('button'));

        expect(screen.queryByText(/disable/i)).not.toBeInTheDocument();
        expect(screen.getByText(/enable/i)).toBeVisible();
        expect(screen.getByText(/edit/i)).toBeVisible();
        expect(screen.getByText(/duplicate/i)).toBeVisible();
        expect(screen.getByText(/remove/i)).toBeVisible();
    });

    it('Calls changeEnabled with true when clicking enable', async () => {
        const changeEnabled = jest.fn();
        render(<PolicyDetailActions
            edit={ jest.fn() }
            duplicate={ jest.fn() }
            delete={ jest.fn() }
            changeEnabled={ changeEnabled }
            disabled={ false }
            isEnabled={ false }
            loadingEnabledChange={ false }
        />);

        await userEvent.click(screen.getByRole('button'));
        await userEvent.click(screen.getByText(/enable/i));
        expect(changeEnabled).toHaveBeenCalledWith(true);
    });

    it('Calls changeEnabled with false when clicking disable', async () => {
        const changeEnabled = jest.fn();
        render(<PolicyDetailActions
            edit={ jest.fn() }
            duplicate={ jest.fn() }
            delete={ jest.fn() }
            changeEnabled={ changeEnabled }
            disabled={ false }
            isEnabled={ true }
            loadingEnabledChange={ false }
        />);

        await userEvent.click(screen.getByRole('button'));
        await userEvent.click(screen.getByText(/disable/i));
        expect(changeEnabled).toHaveBeenCalledWith(false);
    });

    it('enable button is disabled when loadingEnabledChange', async () => {
        render(<PolicyDetailActions
            edit={ jest.fn() }
            duplicate={ jest.fn() }
            delete={ jest.fn() }
            changeEnabled={ jest.fn() }
            disabled={ false }
            isEnabled={ false }
            loadingEnabledChange={ true }
        />);

        await userEvent.click(screen.getByRole('button'));
        expect(screen.getByText(/enable/i)).toHaveAttribute('aria-disabled', 'true');
    });

    it('disable button is disabled when loadingEnabledChange', async () => {
        render(<PolicyDetailActions
            edit={ jest.fn() }
            duplicate={ jest.fn() }
            delete={ jest.fn() }
            changeEnabled={ jest.fn() }
            disabled={ false }
            isEnabled={ true }
            loadingEnabledChange={ true }
        />);

        await userEvent.click(screen.getByRole('button'));
        expect(screen.getByText(/disable/i)).toHaveAttribute('aria-disabled', 'true');
    });

    it('Calls edit when clicking', async () => {
        const edit = jest.fn();
        render(<PolicyDetailActions
            edit={ edit }
            duplicate={ jest.fn() }
            delete={ jest.fn() }
            changeEnabled={ jest.fn() }
            disabled={ false }
            isEnabled={ false }
            loadingEnabledChange={ false }
        />);

        await userEvent.click(screen.getByRole('button'));
        await userEvent.click(screen.getByText(/edit/i));
        expect(edit).toHaveBeenCalled();
    });

    it('Calls duplicate when clicking', async () => {
        const duplicate = jest.fn();
        render(<PolicyDetailActions
            edit={ jest.fn() }
            duplicate={ duplicate }
            delete={ jest.fn() }
            changeEnabled={ jest.fn() }
            disabled={ false }
            isEnabled={ false }
            loadingEnabledChange={ false }
        />);

        await userEvent.click(screen.getByRole('button'));
        await userEvent.click(screen.getByText(/duplicate/i));
        expect(duplicate).toHaveBeenCalled();
    });

    it('Calls remove when clicking', async () => {
        const deleteFn = jest.fn();
        render(<PolicyDetailActions
            edit={ jest.fn() }
            duplicate={ jest.fn() }
            delete={ deleteFn }
            changeEnabled={ jest.fn() }
            disabled={ false }
            isEnabled={ false }
            loadingEnabledChange={ false }
        />);

        await userEvent.click(screen.getByRole('button'));
        await userEvent.click(screen.getByText(/remove/i));
        expect(deleteFn).toHaveBeenCalled();
    });
});
