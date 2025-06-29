import { createSlice } from '@reduxjs/toolkit';
import { httpClient } from '../../Utils/Interceptor';

const initialState = {
    appointments: [],
    totalPagesCount: 0,
    totalItemsCount: 0,
    appointmentInfo: null,
    appointmentService: [],
    prescription: null,
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
        setAppointmentDetail: (state, action) => {
            state.appointmentInfo = action.payload;
            state.appointmentService = action.payload.services;
            state.prescription = action.payload.prescription;
        },
    },
});

export const { setAppointments, setAppointmentDetail } = AppointmentReducer.actions;

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

export const GetAppointmentActionAsync = filter => {
    return async dispatch => {
        try {
            const res = await httpClient.get(`/api/v1/appointment/patient`, {
                params: {
                    Search: filter.search,
                    PageIndex: filter.pageIndex,
                    PageSize: filter.pageSize,
                    StartDate: filter.startDate,
                    EndDate: filter.endDate,
                    SortBy: filter.sortBy,
                    specialtyId: filter.specialtyId,
                    AppointmentStatusEnum: filter.appointmentStatusEnum,
                },
            });
            if (res.isSuccess && res.data) {
                dispatch(setAppointments(res.data));
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

export const GetAppointmentDetailByIdActionAsync = id => {
    return async dispatch => {
        try {
            const res = await httpClient.get(`/api/v1/appointment/${id}`);
            if (res.isSuccess && res.data) {
                dispatch(setAppointmentDetail(res.data));
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
