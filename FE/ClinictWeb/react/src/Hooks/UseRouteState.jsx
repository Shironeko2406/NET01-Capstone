import { useLocation } from 'react-router-dom';

const useRouteState = () => {
    const { state } = useLocation();
    return state || {};
};

export default useRouteState;
