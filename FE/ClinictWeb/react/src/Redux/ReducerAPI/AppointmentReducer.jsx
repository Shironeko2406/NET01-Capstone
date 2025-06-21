import { createSlice } from '@reduxjs/toolkit';
import { httpClient } from '../../Utils/Interceptor';

const initialState = {
    appointments: [],
    totalPagesCount: 0,
    totalItemsCount: 0,
    appointmentInfo: null,
    appointmentService: [],
    prescription: null,
    isExaminationSaved: false,
    isDiagnosisSaved: false,
    isPrescriptionSaved: false,
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
            state.isExaminationSaved = Boolean(action.payload.symptoms);
            state.isDiagnosisSaved = Boolean(action.payload.generalConclusion);
            state.isPrescriptionSaved = Boolean(action.payload.prescription);
        },
        setAppointmentServices: (state, action) => {
            state.appointmentService = action.payload;
        },
        setPrescription: (state, action) => {
            state.prescription = action.payload;
        },
        setAppointmentInfo: (state, action) => {
            state.appointmentInfo = action.payload;
        },
        setIsExaminationSaved: (state, action) => {
            state.isExaminationSaved = action.payload;
        },
        setIsPrescriptionSaved: (state, action) => {
            state.isPrescriptionSaved = action.payload;
        },
        setIsDiagnosisSaved: (state, action) => {
            state.isDiagnosisSaved = action.payload;
        },
    },
});

export const {
    setAppointments,
    setAppointmentDetail,
    setAppointmentServices,
    setPrescription,
    appointmentInfo,
    setIsExaminationSaved,
    setIsPrescriptionSaved,
    setIsDiagnosisSaved,
} = AppointmentReducer.actions;

export default AppointmentReducer.reducer;

export const CreateAppointmentForPatientActionAsync = newApt => {
    return async dispatch => {
        try {
            const res = await httpClient.post(`/api/v1/receptionist/appointment`, newApt);
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
            const res = await httpClient.get(`/api/v1/appointment`, {
                params: {
                    Search: filter.search,
                    PageIndex: filter.pageIndex,
                    PageSize: filter.pageSize,
                    AppointmentDate: filter.appointmentDate,
                    StartTime: filter.startTime,
                    EndTime: filter.endTime,
                    SortBy: filter.sortBy,
                    specialtyId: filter.specialtyId,
                    Status: filter.status,
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

export const GetAppointmentDoctorLoginActionAsync = filter => {
    return async dispatch => {
        try {
            const res = await httpClient.get(`/api/v1/appointment/doctor`, {
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

export const GetAppointmentForLabTechActionAsync = filter => {
    return async dispatch => {
        try {
            const res = await httpClient.get(`/api/v1/appointment/labTech`, {
                params: {
                    Search: filter.search,
                    PageIndex: filter.pageIndex,
                    PageSize: filter.pageSize,
                    AppointmentDate: filter.appointmentDate,
                    Status: filter.status,
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

export const UpdateSymptomAppointmentByIdActionAsync = (id, dataSymptom) => {
    return async dispatch => {
        try {
            const res = await httpClient.patch(`/api/v1/appointment/${id}/symptom`, dataSymptom);
            if (res.isSuccess && res.data) {
                await dispatch(GetAppointmentDetailByIdActionAsync(id));
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

export const UpdateConclusionAppointmentByIdActionAsync = (id, generalConclusion) => {
    return async dispatch => {
        try {
            const res = await httpClient.patch(
                `/api/v1/appointment/${id}/conclusion`,
                generalConclusion
            );
            if (res.isSuccess && res.data) {
                await dispatch(GetAppointmentDetailByIdActionAsync(id));
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

export const UpdateStatusAppointmentByIdActionAsync = (id, status) => {
    return async dispatch => {
        try {
            const res = await httpClient.put(
                `/api/v1/appointment/${id}/status`,
                {},
                {
                    params: {
                        appointmentStatusEnum: status,
                    },
                }
            );
            if (res.isSuccess && res.data) {
                await dispatch(GetAppointmentDetailByIdActionAsync(id));
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
