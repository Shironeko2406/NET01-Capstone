import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export const useFetchList = (fetchAction, querySelector) => {
    const dispatch = useDispatch();
    const data = querySelector();

    useEffect(() => {
        // Khi query thay đổi thì dispatch fetch action
        if (data && data.query) {
            dispatch(fetchAction(data.query));
        }
    }, [dispatch, fetchAction, data.query]);

    return data;
};
