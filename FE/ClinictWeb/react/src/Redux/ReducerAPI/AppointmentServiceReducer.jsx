import { createSlice } from '@reduxjs/toolkit';
import { GetAppointmentDetailByIdActionAsync } from './AppointmentReducer';
import { httpClient } from '../../Utils/Interceptor';

const initialState = {};

const AppointmentServiceReducer = createSlice({
    name: 'AppointmentServiceReducer',
    initialState,
    reducers: {},
});

export const {} = AppointmentServiceReducer.actions;

export default AppointmentServiceReducer.reducer;

export const CreateLabServicesForAppointmentByIdActionAsync = (appointmentId, listData) => {
    return async dispatch => {
        try {
            const res = await httpClient.post(`/api/v1/appointments/${appointmentId}/services`, {
                services: listData,
            });
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

export const DeleteLabServicesByIdActionAsync = (id, appointmentId) => {
    return async dispatch => {
        try {
            const res = await httpClient.delete(`/api/v1/appointments/services/${id}`);
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

export const UpdateNoteLabServicesByIdActionAsync = (id, note, appointmentId) => {
    return async dispatch => {
        try {
            const res = await httpClient.patch(`/api/v1/appointments/services/${id}`, {
                note: note,
            });
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

export const UpdateStatusLabServicesByIdActionAsync = (id, status, appointmentId) => {
    return async dispatch => {
        try {
            const res = await httpClient.patch(
                `/api/v1/appointments/services/${id}/status`,
                {},
                {
                    params: {
                        appointmentServiceStatusEnum: status,
                    },
                }
            );
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
