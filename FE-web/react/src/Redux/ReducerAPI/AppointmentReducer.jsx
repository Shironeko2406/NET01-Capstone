import { createSlice } from '@reduxjs/toolkit';
import { httpClient } from '../../Utils/Interceptor';

const initialState = {
    appointments: [],
    totalPagesCount: 0,
    totalItemsCount: 0,
};

const AppointmentReducer = createSlice({
    name: 'AppointmentReducer',
    initialState,
    reducers: {
        setAppointments: (state, action) => {
            state.appointments = action.payload.items;
            state.totalItemsCount = action.payload.totalItemsCount;
            state.totalPagesCount = action.payload.totalPagesCount;
        },
    },
});

export const { setAppointments } = AppointmentReducer.actions;

export default AppointmentReducer.reducer;

export const CreateAppointmentActionAsync = newApt => {
    return async dispatch => {
        try {
            const res = await httpClient.post(`/api/v1/appointment/login`, newApt);
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
