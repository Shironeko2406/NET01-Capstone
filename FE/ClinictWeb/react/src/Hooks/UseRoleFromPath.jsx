import { useLocation } from 'react-router-dom';

export const useRoleFromPath = () => {
    const location = useLocation();
    const segments = location.pathname.split('/').filter(Boolean);
    return segments[0] || '';
};
