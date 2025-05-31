import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { TOKEN_AUTHOR, USER_LOGIN } from './Interceptor';
import { getDataJSONStorage, getDataTextStorage } from './UtilFunction';

const ProtectedRoute = ({ requiredRole }) => {
    const accessToken = getDataTextStorage(TOKEN_AUTHOR);
    const userLogin = getDataJSONStorage(USER_LOGIN);

    if (!accessToken || !userLogin) {
        return <Navigate to="/" />; // Chưa đăng nhập -> chuyển về trang login
    }

    const userRole = userLogin.role;

    // Nếu vai trò không đúng với role yêu cầu
    if (userRole !== requiredRole) {
        switch (userRole) {
            case 'Administrator':
                return <Navigate to="/admin" replace />;
            case 'Doctor':
                return <Navigate to="/doctor" replace />;
            case 'Receptionist':
                return <Navigate to="/receptionist" replace />;
            case 'Patient':
                return <Navigate to="/patient" replace />;
            case 'LabTechnician':
                return <Navigate to="/labTech" replace />;
            default:
                return <Navigate to="/" replace />;
        }
    }

    // Đúng role yêu cầu => cho phép truy cập
    return <Outlet />;
};

export default ProtectedRoute;
