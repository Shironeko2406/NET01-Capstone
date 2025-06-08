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
