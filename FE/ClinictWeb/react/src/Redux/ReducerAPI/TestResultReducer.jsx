import { createSlice } from '@reduxjs/toolkit';
import { httpClient } from '../../Utils/Interceptor';
import { GetAppointmentDetailByIdActionAsync } from './AppointmentReducer';

const initialState = {};

const TestResultReducer = createSlice({
    name: 'TestResultReducer',
    initialState,
    reducers: {},
});

export const {} = TestResultReducer.actions;

export default TestResultReducer.reducer;

export const UpdateTestResultByIdActionAsync = (testId, dataUpdate, appointmentId) => {
    return async dispatch => {
        try {
            const res = await httpClient.put(`/api/v1/test-result/${testId}`, dataUpdate);
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
