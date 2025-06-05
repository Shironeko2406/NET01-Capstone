import { createSlice } from '@reduxjs/toolkit';
import { httpClient } from '../../Utils/Interceptor';

const initialState = {
    users: [],
    totalPagesCount: 0,
    totalItemsCount: 0,
};

const UsersReducer = createSlice({
    name: 'UsersReducer',
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload.items;
            state.totalItemsCount = action.payload.totalItemsCount;
            state.totalPagesCount = action.payload.totalPagesCount;
        },
    },
});

export const { setUsers } = UsersReducer.actions;

export default UsersReducer.reducer;

export const GetUsersActionAsync = filter => {
    return async dispatch => {
        try {
            const res = await httpClient.get(`/api/v1/user/filter`, {
                params: {
                    Search: filter.search,
                    PageIndex: filter.pageIndex,
                    Role: filter.role,
                    PageSize: filter.pageSize,
                },
            });
            if (res.isSuccess && res.data) {
                dispatch(setUsers(res.data));
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    };
};

export const CreateUsersInternalActionAsync = newUser => {
    return async dispatch => {
        try {
            const res = await httpClient.post(`/api/v1/user/register/internal`, newUser);
            if (res.isSuccess && res.data) {
                return { success: true, data: null, message: res.message };
            } else if (res.isSuccess && !res.data) {
                return { success: false, data: null, message: res.message };
            } else {
                return { success: false, message: res.message };
            }
        } catch (error) {
            console.error(error);
            return { success: false, message: 'System error' };
        }
    };
};
