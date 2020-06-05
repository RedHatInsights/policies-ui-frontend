import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

    it('Shows menu with disable when isEnabled is true', () => {
        render(<PolicyDetailActions
            edit={ jest.fn() }
            duplicate={ jest.fn() }
            delete={ jest.fn() }
            changeEnabled={ jest.fn() }
            disabled={ false }
            isEnabled={ true }
            loadingEnabledChange={ false }
        />);

        userEvent.click(screen.getByRole('button'));

        expect(screen.queryByText(/enable/i)).toBeFalsy();
        expect(screen.getByText(/disable/i)).toBeVisible();
        expect(screen.getByText(/edit/i)).toBeVisible();
        expect(screen.getByText(/duplicate/i)).toBeVisible();
        expect(screen.getByText(/delete/i)).toBeVisible();
    });

    it('Shows menu with enable when isEnabled is false', () => {
        render(<PolicyDetailActions
            edit={ jest.fn() }
            duplicate={ jest.fn() }
            delete={ jest.fn() }
            changeEnabled={ jest.fn() }
            disabled={ false }
            isEnabled={ false }
            loadingEnabledChange={ false }
        />);

        userEvent.click(screen.getByRole('button'));

        expect(screen.queryByText(/disable/i)).toBeFalsy();
        expect(screen.getByText(/enable/i)).toBeVisible();
        expect(screen.getByText(/edit/i)).toBeVisible();
        expect(screen.getByText(/duplicate/i)).toBeVisible();
        expect(screen.getByText(/delete/i)).toBeVisible();
    });

    it('Calls changeEnabled with true when clicking enable', () => {
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

        userEvent.click(screen.getByRole('button'));
        userEvent.click(screen.getByText(/enable/i));
        expect(changeEnabled).toHaveBeenCalledWith(true);
    });

    it('Calls changeEnabled with false when clicking disable', () => {
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

        userEvent.click(screen.getByRole('button'));
        userEvent.click(screen.getByText(/disable/i));
        expect(changeEnabled).toHaveBeenCalledWith(false);
    });

    it('enable button is disabled when loadingEnabledChange', () => {
        render(<PolicyDetailActions
            edit={ jest.fn() }
            duplicate={ jest.fn() }
            delete={ jest.fn() }
            changeEnabled={ jest.fn() }
            disabled={ false }
            isEnabled={ false }
            loadingEnabledChange={ true }
        />);

        userEvent.click(screen.getByRole('button'));
        expect(screen.getByText(/enable/i)).toHaveAttribute('aria-disabled', 'true');
    });

    it('disable button is disabled when loadingEnabledChange', () => {
        render(<PolicyDetailActions
            edit={ jest.fn() }
            duplicate={ jest.fn() }
            delete={ jest.fn() }
            changeEnabled={ jest.fn() }
            disabled={ false }
            isEnabled={ true }
            loadingEnabledChange={ true }
        />);

        userEvent.click(screen.getByRole('button'));
        expect(screen.getByText(/disable/i)).toHaveAttribute('aria-disabled', 'true');
    });

    it('Calls edit when clicking', () => {
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

        userEvent.click(screen.getByRole('button'));
        userEvent.click(screen.getByText(/edit/i));
        expect(edit).toHaveBeenCalled();
    });

    it('Calls duplicate when clicking', () => {
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

        userEvent.click(screen.getByRole('button'));
        userEvent.click(screen.getByText(/duplicate/i));
        expect(duplicate).toHaveBeenCalled();
    });

    it('Calls delete when clicking', () => {
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

        userEvent.click(screen.getByRole('button'));
        userEvent.click(screen.getByText(/delete/i));
        expect(deleteFn).toHaveBeenCalled();
    });
});
