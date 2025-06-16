import { createSlice } from '@reduxjs/toolkit';
import { httpClient } from '../../Utils/Interceptor';

const initialState = {
    appointments: [],
    totalPagesCount: 0,
    totalItemsCount: 0,
    appointmentInfo: {
        appointmentId: '16e96048-fc9d-478e-74bb-08dda6a312d3',
        appointmentCode: 'APT-03F7C096',
        appointmentDate: '2025-06-08T00:00:00',
        startTime: '14:00:00',
        endTime: '16:00:00',
        status: 'Booked',
        note: 'Ngứa ngáy, mề đay',
        symptoms: null,
        generalConclusion: 'Viêm gan B',
        patientId: 'e151a8b7-f7b8-4015-fcfb-08dda6a312bb',
        patientName: 'Nguyễn Hải My',
        patientPhone: '0902451769',
        patientGender: 'Female',
        patientDob: '2020-02-05T00:00:00',
        doctorId: '526bebbb-4964-48cf-c88c-08dd989b54d5',
        doctorName: 'Le Van C',
        doctorAvatar: 'https://example.com/avatar3.jpg',
        specialtyName: 'Da liễu',
    },
    appointmentService: [
        {
            appointmentServiceId: '13e114e2-f3b8-4283-b107-08ddaa949338',
            serviceId: '45e44601-12e6-40b8-1aaf-08dd9a24116c',
            serviceName: 'Thử nước tiểu',
            serviceDescription: 'string',
            status: 'Completed',
            price: 120,
            note: 'Nghi ngờ suy thận mạn',
            testResult: {
                testResultId: '3b3d2f5f-5cc8-4e7c-0b5e-08ddaa95f97c',
                result: 'Nước tiểu đặc, có máu',
                resultDate: '2025-06-13T16:44:51.962',
                createdBy: 'labtech',
            },
        },
    ],
    prescription: {
        prescriptionId: '13a5f4d4-52db-40b6-f494-08ddaa9fdbe3',
        notes: 'Đơn khám này',
        prescriptionDetails: [
            {
                medicineId: '0326e26d-2e0b-48f9-2d7f-08dd9afc46f8',
                medicineName: 'Vitamin C',
                quantity: 2,
                dosageInstructions: '1 này/ cũ7',
                unit: 'Box',
                price: 12000,
            },
            {
                medicineId: '00d7a552-796c-476a-5bca-08dda129fe76',
                medicineName: 'Amoxicillin ',
                quantity: 1,
                dosageInstructions: '1 này/ cũ7',
                unit: 'Box',
                price: 190000,
            },
        ],
    },
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
        setAppointmentServices: (state, action) => {
            state.appointmentService = action.payload;
        },
        setPrescription: (state, action) => {
            state.prescription = action.payload;
        },
    },
});

export const { setAppointments, setAppointmentDetail, setAppointmentServices, setPrescription } =
    AppointmentReducer.actions;

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
