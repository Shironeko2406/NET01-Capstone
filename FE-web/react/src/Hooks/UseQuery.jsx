import { useState } from 'react';

export const useQuery = initialQuery => {
    const [query, setQuery] = useState(initialQuery || {});

    const updateQuery = updates => {
        setQuery(prev => ({
            ...prev,
            ...updates,
        }));
    };

    const resetPage = () => {
        if ('pageIndex' in query) {
            setQuery(prev => ({
                ...prev,
                pageIndex: 1,
            }));
        }
    };

    return {
        query,
        updateQuery,
        resetPage,
        setQuery,
    };
};
