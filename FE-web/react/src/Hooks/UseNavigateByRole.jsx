import { useNavigate } from 'react-router-dom';

export const useNavigateByRole = () => {
    const navigate = useNavigate();

    return role => {
        const rolePaths = {
            Patient: '/patient',
            Doctor: '/doctor',
            Receptionist: '/receptionist',
            Administrator: '/admin',
            LabTechnician: '/labTech',
        };

        navigate(rolePaths[role] || '/');
    };
};
