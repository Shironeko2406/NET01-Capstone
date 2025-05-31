import { configureStore } from '@reduxjs/toolkit';
import AuthenticationReducer from './ReducerAPI/AuthenticationReducer';

export const store = configureStore({
    reducer: {
        number: (state = 1) => state,
        AuthenticationReducer,
    },
});
