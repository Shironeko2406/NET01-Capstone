export const formatCurrency = amount => {
    return new Intl.NumberFormat('vi-VN').format(amount);
};

export const formatCurrencyVN = amount => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};
