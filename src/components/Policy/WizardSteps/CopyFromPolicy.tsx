import * as React from 'react';
import { PolicyToolbar } from '../TableToolbar/PolicyTableToolbar';
import { usePolicyFilter, usePolicyPage } from '../../../hooks';

export const CopyFromPolicy: React.FunctionComponent = () => {

    const policyFilter = usePolicyFilter();
    const policyPage = usePolicyPage(policyFilter.debouncedFilters, 5);

    return (
        <PolicyToolbar
            onPaginationChanged={ policyPage.changePage }
            page={ policyPage.currentPage }
            perPage={ policyPage.itemsPerPage }
            showPerPageOptions={ false }
            hideActions={ true }
            hideBulkSelect={ true }
            filterElements={ policyFilter.filters }
            setFilterElements={ policyFilter.setFilters }
            clearFilters={ policyFilter.clearFilterHandler }
            count={ 5 }
        />
    );
};
