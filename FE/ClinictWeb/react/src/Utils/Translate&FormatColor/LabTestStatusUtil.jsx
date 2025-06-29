export const getLabTestStatusColor = status => {
    const colors = {
        notstarted: 'bg-gray-100 text-gray-800 border-gray-200',
        inprogress: 'bg-blue-100 text-blue-800 border-blue-200',
        completed: 'bg-green-100 text-green-800 border-green-200',
    };

    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export const getLabTestStatusTranslate = status => {
    const labels = {
        notstarted: 'Chưa bắt đầu',
        inprogress: 'Đang thực hiện',
        completed: 'Hoàn thành',
    };

    return labels[status?.toLowerCase()] || 'Không xác định';
};
