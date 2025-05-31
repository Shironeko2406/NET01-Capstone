import { createSlice } from '@reduxjs/toolkit';
import {
    getDataJSONStorage,
    setDataJSONStorage,
    setDataTextStorage,
} from '../../Utils/UtilFunction';
import { jwtDecode } from 'jwt-decode';
import { httpClient, TOKEN_AUTHOR, USER_LOGIN } from '../../Utils/Interceptor';

const initialState = {
    userLogin: getDataJSONStorage('userLogin'),
};

const AuthenticationReducer = createSlice({
    name: 'AuthenticationReducer',
    initialState,
    reducers: {
        setUserLogin: (state, action) => {
            state.userLogin = action.payload;
        },
    },
});

export const { setUserLogin } = AuthenticationReducer.actions;

export default AuthenticationReducer.reducer;

export const LoginActionAsync = dataLogin => {
    return async dispatch => {
        try {
            const res = await httpClient.post(`/api/v1/auth/login`, dataLogin);

            if (res.isSuccess && res.data) {
                const user = jwtDecode(res.data.accessToken);
                dispatch(setUserLogin(user));
                setDataJSONStorage(USER_LOGIN, user);
                setDataTextStorage(TOKEN_AUTHOR, res.data.accessToken);
                return { success: true, data: user, message: res.message }; // ✅ Thành công thực sự
            } else if (res.isSuccess && !res.data) {
                return { success: false, data: null, message: res.message }; // ✅ Lỗi logic (sai tài khoản)
            } else {
                return { success: false, message: res.message }; // ❌ Lỗi hệ thống
            }
        } catch (error) {
            console.error(error);
            return { success: false, message: 'System error' }; // ❌ Lỗi hệ thống
        }
    };
};
