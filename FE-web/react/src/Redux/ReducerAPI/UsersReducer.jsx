import { createSlice } from '@reduxjs/toolkit';
import { httpClient } from '../../Utils/Interceptor';

const initialState = {
    users: [],
    totalPagesCount: 0,
    totalItemsCount: 0,
    doctors: [],
};

const UsersReducer = createSlice({
    name: 'UsersReducer',
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload.items;
            state.totalItemsCount = action.payload.totalItemsCount;
            state.totalPagesCount = action.payload.totalPagesCount;
        },
        setDoctorAvailable: (state, action) => {
            state.doctors = action.payload;
        },
    },
});

export const { setUsers, setDoctorAvailable } = UsersReducer.actions;

export default UsersReducer.reducer;

export const RegisterUserActionAsync = newUser => {
    return async dispatch => {
        try {
            const res = await httpClient.post(`/api/v1/user/register`, newUser);
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

export const GetDoctorAvailableActionAsync = filter => {
    return async dispatch => {
        try {
            const res = await httpClient.get(`/api/v1/user/doctor-avaiable`, {
                params: {
                    SpecialtyId: filter.specialtyId,
                    Date: filter.date,
                    StartTime: filter.startTime,
                    EndTime: filter.endTime,
                },
            });
            if (res.isSuccess && res.data) {
                dispatch(setDoctorAvailable(res.data));
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
