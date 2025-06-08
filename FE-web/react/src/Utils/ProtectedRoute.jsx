import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { TOKEN_AUTHOR, USER_LOGIN } from './Interceptor';
import { getDataJSONStorage, getDataTextStorage } from './UtilFunction';

const ProtectedRoute = ({ children }) => {
    const accessToken = getDataTextStorage(TOKEN_AUTHOR);
    const userLogin = getDataJSONStorage(USER_LOGIN);

    if (!userLogin || !accessToken) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
