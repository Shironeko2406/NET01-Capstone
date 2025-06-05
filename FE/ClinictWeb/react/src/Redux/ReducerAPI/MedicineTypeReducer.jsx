import { createSlice } from '@reduxjs/toolkit';
import { httpClient } from '../../Utils/Interceptor';

const initialState = {
    medicineTypes: [],
};

const MedicineTypeReducer = createSlice({
    name: 'MedicineTypeReducer',
    initialState,
    reducers: {
        setMedicineType: (state, action) => {
            state.medicineTypes = action.payload;
        },
    },
});

export const { setMedicineType } = MedicineTypeReducer.actions;

export default MedicineTypeReducer.reducer;

export const GetMedicineTypesActionAsync = () => {
    return async dispatch => {
        try {
            const res = await httpClient.get(`/api/v1/medicineType`);
            if (res.isSuccess && res.data) {
                dispatch(setMedicineType(res.data));
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

export const DeleteMedicineTypeActionAsync = id => {
    return async dispatch => {
        try {
            const res = await httpClient.delete(`/api/v1/medicineType/${id}`);
            if (res.isSuccess && res.data) {
                await dispatch(GetMedicineTypesActionAsync());
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

export const CreateMedicineTypeActionAsync = newMedicineType => {
    return async dispatch => {
        try {
            const res = await httpClient.post(`/api/v1/medicineType`, newMedicineType);
            if (res.isSuccess && res.data) {
                await dispatch(GetMedicineTypesActionAsync());
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
