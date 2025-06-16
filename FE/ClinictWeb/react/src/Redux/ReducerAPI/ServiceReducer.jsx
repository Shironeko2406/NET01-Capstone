import { createSlice } from '@reduxjs/toolkit';
import { httpClient } from '../../Utils/Interceptor';

const initialState = {
    services: [
        {
            serviceId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            name: 'Xét nghiệm máu tổng quát',
            price: 120000,
            description: 'Kiểm tra các chỉ số máu cơ bản',
        },
        {
            serviceId: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
            name: 'Điện tâm đồ (ECG)',
            price: 100000,
            description: 'Đo hoạt động điện của tim',
        },
        {
            serviceId: '3fa85f64-5717-4562-b3fc-2c963f66afa8',
            name: 'Xét nghiệm đường huyết',
            price: 80000,
            description: 'Kiểm tra nồng độ glucose trong máu',
        },
        {
            serviceId: '3fa85f64-5717-4562-b3fc-2c963f66afa9',
            name: 'Xét nghiệm lipid máu',
            price: 150000,
            description: 'Kiểm tra cholesterol và lipid',
        },
        {
            serviceId: '3fa85f64-5717-4562-b3fc-2c963f66afaa',
            name: 'Siêu âm tim',
            price: 300000,
            description: 'Chẩn đoán hình ảnh tim',
        },
        {
            serviceId: '3fa85f64-5717-4562-b3fc-2c963f66afab',
            name: 'X-quang ngực',
            price: 200000,
            description: 'Chụp X-quang vùng ngực',
        },
    ],
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
