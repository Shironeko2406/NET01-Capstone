export const getMedicineStatusColor = status => {
    const colors = {
        instock: 'bg-green-100 text-green-800',
        lowstock: 'bg-yellow-100 text-yellow-800',
        outofstock: 'bg-red-100 text-red-800',
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

export const getMedicineStatusTranslate = status => {
    const labels = {
        instock: 'Còn hàng',
        lowstock: 'Sắp hết hàng',
        outofstock: 'Hết hàng',
    };
    return labels[status?.toLowerCase()] || 'Không xác định';
};

export const getMedicineUnitTranslate = unit => {
    const labels = {
        box: 'Hộp',
        strip: 'Vỉ',
        bottle: 'Chai',
        tablet: 'Viên',
        tube: 'Tuýp',
        other: 'Khác',
    };
    return labels[unit?.toLowerCase()] || 'Không xác định';
};

export const getSortFieldTranslate = field => {
    const map = {
        name: 'Tên thuốc',
        price: 'Giá',
        stockQuantity: 'Số lượng tồn',
    };
    return map[field] || field;
};
