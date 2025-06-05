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
