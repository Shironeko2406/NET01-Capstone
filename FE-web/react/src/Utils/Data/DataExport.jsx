const roles = [
    { value: 'Patient', label: 'Bệnh nhân' },
    { value: 'Doctor', label: 'Bác sĩ' },
    { value: 'Receptionist', label: 'Lễ tân' },
    { value: 'Administrator', label: 'Quản trị viên' },
    { value: 'LabTechnician', label: 'Xét nghiệm viên' },
];

const stockTypes = [
    { value: 'Import', label: 'Nhập kho' },
    { value: 'Export', label: 'Xuất kho' },
    { value: 'Adjust', label: 'Điều chỉnh kho' },
];

const sortOptions = [
    { value: 'Ascending', label: 'Tăng dần' },
    { value: 'Descending', label: 'Giảm dần' },
];

const genders = [
    { value: 'Male', label: 'Nam' },
    { value: 'Female', label: 'Nữ' },
    { value: 'Other', label: 'Khác' },
];

const statuses = ['InStock', 'LowStock', 'OutOfStock'];

const sortFieldOptions = [
    { value: 'name', label: 'Tên thuốc' },
    { value: 'price', label: 'Giá' },
    { value: 'stockQuantity', label: 'Số lượng tồn' },
];

const pageSizeOptions = ['5', '10'];

export { roles, genders, statuses, sortFieldOptions, pageSizeOptions, stockTypes, sortOptions };
