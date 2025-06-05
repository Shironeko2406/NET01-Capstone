// src/utils/genderUtils.ts
export const getGenderTranslate = gender => {
    const map = {
        Male: 'Nam',
        Female: 'Nữ',
        Other: 'Khác',
    };
    return map[gender] || gender;
};

export const getGenderColor = gender => {
    const colors = {
        Male: 'bg-blue-100 text-blue-800',
        Female: 'bg-pink-100 text-pink-800',
        Other: 'bg-gray-100 text-gray-800',
    };
    return colors[gender] || 'bg-gray-100 text-gray-800';
};
