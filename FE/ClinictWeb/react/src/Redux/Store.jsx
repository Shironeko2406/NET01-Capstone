import { configureStore } from '@reduxjs/toolkit';
import AuthenticationReducer from './ReducerAPI/AuthenticationReducer';
import ServiceReducer from './ReducerAPI/ServiceReducer';
import SpecialtyReducer from './ReducerAPI/SpecialtyReducer';
import UsersReducer from './ReducerAPI/UsersReducer';
import MedicineTypeReducer from './ReducerAPI/MedicineTypeReducer';
import CityReducer from './ReducerAPI/CityReducer';
import MedicineReducer from './ReducerAPI/MedicineReducer';
import MedicineStockHistoryReducer from './ReducerAPI/MedicineStockHistoryReducer';
import AppointmentReducer from './ReducerAPI/AppointmentReducer';
import StatisticReducer from './ReducerAPI/StatisticReducer';
import AppointmentServiceReducer from './ReducerAPI/AppointmentServiceReducer';
import PrescriptionReducer from './ReducerAPI/PrescriptionReducer';
import TestResultReducer from './ReducerAPI/TestResultReducer';

export const store = configureStore({
    reducer: {
        number: (state = 1) => state,
        AuthenticationReducer,
        ServiceReducer,
        SpecialtyReducer,
        UsersReducer,
        MedicineTypeReducer,
        CityReducer,
        MedicineReducer,
        MedicineStockHistoryReducer,
        AppointmentReducer,
        StatisticReducer,
        AppointmentServiceReducer,
        PrescriptionReducer,
        TestResultReducer,
    },
});
