import { createSlice } from '@reduxjs/toolkit';
import { httpClient } from '../../Utils/Interceptor';

const initialState = {
    appointmentStatistic: null,
};

const StatisticReducer = createSlice({
    name: 'StatisticReducer',
    initialState,
    reducers: {
        setAppointmentStatistic: (state, action) => {
            state.appointmentStatistic = action.payload;
        },
    },
});

export const { setAppointmentStatistic } = StatisticReducer.actions;

export default StatisticReducer.reducer;

export const GetAppointmentStatisticActionAsync = () => {
    return async dispatch => {
        try {
            const res = await httpClient.get(`api/v1/statistic/appointment`);
            if (res.isSuccess && res.data) {
                dispatch(setAppointmentStatistic(res.data));
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
