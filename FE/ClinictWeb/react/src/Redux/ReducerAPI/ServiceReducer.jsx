import { createSlice } from '@reduxjs/toolkit';
import { httpClient } from '../../Utils/Interceptor';

const initialState = {
    services: [],
    totalPagesCount: 0,
    totalItemsCount: 0,
};

const ServiceReducer = createSlice({
    name: 'ServiceReducer',
    initialState,
    reducers: {
        setServices: (state, action) => {
            state.services = action.payload.items;
            state.totalItemsCount = action.payload.totalItemsCount;
            state.totalPagesCount = action.payload.totalPagesCount;
        },
    },
});

export const { setServices } = ServiceReducer.actions;

export default ServiceReducer.reducer;

export const GetServicesActionAsync = filter => {
    return async dispatch => {
        try {
            const res = await httpClient.get(`/api/v1/service`, {
                params: {
                    SearchKeyword: filter.search,
                    PageIndex: filter.pageIndex,
                    PageSize: filter.pageSize,
                },
            });
            if (res.isSuccess && res.data) {
                dispatch(setServices(res.data));
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

export const DeleteServiceActionAsync = (id, filter) => {
    return async dispatch => {
        try {
            const res = await httpClient.delete(`/api/v1/service/${id}`);
            if (res.isSuccess && res.data) {
                await dispatch(GetServicesActionAsync(filter));
                return { success: true, data: null, message: res.message }; // ✅ Thành công thực sự
            } else if (res.isSuccess && !res.data) {
                return { success: false, data: null, message: res.message }; // ✅ Lỗi logic (sai tài khoản)
            } else {
                return { success: false, message: res.message }; // ❌ Lỗi hệ thống
            }
        } catch (error) {
            console.error(error);
            return { success: false, message: 'System error' }; // ❌ Lỗi hệ thống
        }
    };
};

export const CreateServiceActionAsync = (newService, filter) => {
    return async dispatch => {
        try {
            const res = await httpClient.post(`/api/v1/service`, newService);
            if (res.isSuccess && res.data) {
                await dispatch(GetServicesActionAsync(filter));
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
