export const getAppointmentServiceStatusColor = status => {
    const colors = {
        assigned: 'bg-yellow-100 text-yellow-800 border-yellow-300 shadow-sm',
        inprogress: 'bg-blue-100 text-blue-800 border-blue-300 shadow-sm',
        completed: 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-sm',
        cancelled: 'bg-red-100 text-red-800 border-red-300 shadow-sm',
    };
    return colors[status?.toLowerCase()] || 'bg-gray-200 text-gray-700 border-gray-300 shadow-sm';
};

export const getAppointmentServiceStatusLabel = status => {
    const labels = {
        assigned: 'Đã chỉ định',
        inprogress: 'Đang thực hiện',
        completed: 'Đã hoàn thành',
        cancelled: 'Đã hủy',
    };
    return labels[status?.toLowerCase()] || 'Không xác định';
};
