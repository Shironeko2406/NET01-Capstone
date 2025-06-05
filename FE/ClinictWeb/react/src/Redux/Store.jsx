import { configureStore } from '@reduxjs/toolkit';
import AuthenticationReducer from './ReducerAPI/AuthenticationReducer';
import ServiceReducer from './ReducerAPI/ServiceReducer';
import SpecialtyReducer from './ReducerAPI/SpecialtyReducer';
import UsersReducer from './ReducerAPI/UsersReducer';
import MedicineTypeReducer from './ReducerAPI/MedicineTypeReducer';
import CityReducer from './ReducerAPI/CityReducer';
import MedicineReducer from './ReducerAPI/MedicineReducer';
import MedicineStockHistoryReducer from './ReducerAPI/MedicineStockHistoryReducer';

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
    },
});
