import { configureStore } from '@reduxjs/toolkit';
import CityReducer from './ReducerAPI/CityReducer';
import UsersReducer from './ReducerAPI/UsersReducer';
import AuthenticationReducer from './ReducerAPI/AuthenticationReducer';
import SpecialtyReducer from './ReducerAPI/SpecialtyReducer';
import AppointmentReducer from './ReducerAPI/AppointmentReducer';
import MedicineTypeReducer from './ReducerAPI/MedicineTypeReducer';

export const store = configureStore({
    reducer: {
        number: (state = 1) => state,
        CityReducer,
        UsersReducer,
        AuthenticationReducer,
        SpecialtyReducer,
        AppointmentReducer,
        MedicineTypeReducer,
    },
});
