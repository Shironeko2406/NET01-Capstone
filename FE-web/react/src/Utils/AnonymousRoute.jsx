import { Navigate, useLocation } from 'react-router-dom';
import { TOKEN_AUTHOR, USER_LOGIN } from './Interceptor';
import { getDataJSONStorage, getDataTextStorage } from './UtilFunction';

const AnonymousRoute = ({ children }) => {
    const userLogin = getDataJSONStorage(USER_LOGIN);
    const accessToken = getDataTextStorage(TOKEN_AUTHOR);
    const location = useLocation();

    if (userLogin && accessToken) {
        const previousPage = location.state?.from?.pathname || '/';
        return <Navigate to={previousPage} replace />;
    }

    return children;
};

export default AnonymousRoute;
