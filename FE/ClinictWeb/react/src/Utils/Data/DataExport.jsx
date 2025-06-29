import { ArrowUp, Plus, Settings } from 'lucide-react';

const roles = [
    { value: 'Patient', label: 'Bệnh nhân' },
    { value: 'Doctor', label: 'Bác sĩ' },
    { value: 'Receptionist', label: 'Lễ tân' },
    { value: 'Administrator', label: 'Quản trị viên' },
    { value: 'LabTechnician', label: 'Xét nghiệm viên' },
];

const medicineUnits = [
    { value: 'box', label: 'Hộp' },
    { value: 'strip', label: 'Vỉ' },
    { value: 'bottle', label: 'Chai' },
    { value: 'tablet', label: 'Viên' },
    { value: 'tube', label: 'Tuýp' },
    { value: 'other', label: 'Khác' },
];

const stockTypes = [
    { value: 'Import', label: 'Nhập kho' },
    { value: 'Export', label: 'Xuất kho' },
    { value: 'Adjust', label: 'Điều chỉnh kho' },
];

const stockActions = [
    { type: 'Import', label: 'Nhập kho', icon: <Plus className="mr-2 h-4 w-4" /> },
    { type: 'Export', label: 'Xuất kho', icon: <ArrowUp className="mr-2 h-4 w-4" /> },
    { type: 'Adjust', label: 'Điều chỉnh kho', icon: <Settings className="mr-2 h-4 w-4" /> },
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

export {
    roles,
    genders,
    statuses,
    sortFieldOptions,
    pageSizeOptions,
    stockTypes,
    sortOptions,
    medicineUnits,
    stockActions,
};
