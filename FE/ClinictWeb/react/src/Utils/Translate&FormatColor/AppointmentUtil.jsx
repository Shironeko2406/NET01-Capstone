export const getAppointmentStatusColor = status => {
    const colors = {
        booked: 'bg-green-500 text-white',
        waiting: 'bg-yellow-400 text-black',
        inprogress: 'bg-blue-500 text-white',
        completed: 'bg-gray-600 text-white',
        cancelled: 'bg-red-500 text-white',
    };
    return colors[status?.toLowerCase()] || 'bg-gray-300 text-black';
};

export const getAppointmentStatusTranslate = status => {
    const labels = {
        booked: 'Đã đặt lịch',
        waiting: 'Đang chờ khám',
        inprogress: 'Đang khám',
        completed: 'Đã khám xong',
        cancelled: 'Đã hủy',
    };
    return labels[status?.toLowerCase()] || 'Không xác định';
};
