import { createSlice } from '@reduxjs/toolkit';
import { GetAppointmentDetailByIdActionAsync } from './AppointmentReducer';
import { httpClient } from '../../Utils/Interceptor';

const initialState = {};

const PrescriptionReducer = createSlice({
    name: 'PrescriptionReducer',
    initialState,
    reducers: {},
});

export const {} = PrescriptionReducer.actions;

export default PrescriptionReducer.reducer;

export const UpdatePrescriptionByAppointmentIdActionAsync = (dataUpdate, appointmentId) => {
    return async dispatch => {
        try {
            const res = await httpClient.put(`/api/v1/prescription/${appointmentId}`, dataUpdate);
            if (res.isSuccess && res.data) {
                await dispatch(GetAppointmentDetailByIdActionAsync(appointmentId));
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
