import { Outlet, Navigate } from 'react-router-dom';
import { TOKEN_AUTHOR, USER_LOGIN } from './Interceptor';
import { getDataJSONStorage, getDataTextStorage } from './UtilFunction';

const AnonymousRoute = () => {
    const accessToken = getDataTextStorage(TOKEN_AUTHOR);
    const userLogin = getDataJSONStorage(USER_LOGIN); // Fetch the user data from storage

    if (accessToken && userLogin) {
        const role = userLogin?.role;

        // Redirect based on the role
        switch (role) {
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

    return <Outlet />;
};

export default AnonymousRoute;
