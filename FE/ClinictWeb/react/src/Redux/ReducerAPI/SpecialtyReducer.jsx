import { createSlice } from '@reduxjs/toolkit';
import { httpClient } from '../../Utils/Interceptor';

const initialState = {
    specialties: [],
};

const SpecialtyReducer = createSlice({
    name: 'SpecialtyReducer',
    initialState,
    reducers: {
        setSpecialties: (state, action) => {
            state.specialties = action.payload;
        },
    },
});

export const { setSpecialties } = SpecialtyReducer.actions;

export default SpecialtyReducer.reducer;

export const GetSpecialtiesActionAsync = () => {
    return async dispatch => {
        try {
            const res = await httpClient.get(`/api/v1/specialty`);
            if (res.isSuccess && res.data) {
                dispatch(setSpecialties(res.data));
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

export const CreateSpecialtyActionAsync = newSpecialty => {
    return async dispatch => {
        try {
            const res = await httpClient.post(`/api/v1/specialty`, newSpecialty);
            if (res.isSuccess && res.data) {
                await dispatch(GetSpecialtiesActionAsync());
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

export const DeleteSpecialtyActionAsync = id => {
    return async dispatch => {
        try {
            const res = await httpClient.delete(`/api/v1/specialty/${id}`);
            if (res.isSuccess && res.data) {
                await dispatch(GetSpecialtiesActionAsync());
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
