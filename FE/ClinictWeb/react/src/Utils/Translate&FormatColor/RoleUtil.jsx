import { Mars, Venus, HelpCircle } from 'lucide-react';

export const getRoleColor = role => {
    const colors = {
        administrator: 'bg-red-100 text-red-800',
        doctor: 'bg-blue-100 text-blue-800',
        receptionist: 'bg-green-100 text-green-800',
        patient: 'bg-gray-100 text-gray-800',
        labtechnician: 'bg-purple-100 text-purple-800',
    };
    return colors[role?.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

export const getRoleTranslate = role => {
    const labels = {
        administrator: 'Quản trị viên',
        doctor: 'Bác sĩ',
        receptionist: 'Lễ tân',
        patient: 'Bệnh nhân',
        labtechnician: 'Xét nghiệm viên',
    };
    return labels[role?.toLowerCase()] || 'Không xác định';
};

export const getGenderIcon = gender => {
    const size = 14;
    const icons = {
        Male: <Mars size={size} className="mr-1" />,
        Female: <Venus size={size} className="mr-1" />,
        Other: <HelpCircle size={size} className="mr-1" />,
    };
    return icons[gender] || <HelpCircle size={size} className="mr-1" />;
};
