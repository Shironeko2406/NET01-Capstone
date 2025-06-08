const stepTitles = [
    'Thông tin bệnh nhân',
    'Chọn chuyên khoa',
    'Chọn ngày khám',
    'Chọn giờ khám',
    'Chọn bác sĩ',
    'Xác nhận thông tin',
];

const stepTitlesMobile = [
    'Thông tin BN',
    'Chuyên khoa',
    'Chọn ngày',
    'Chọn giờ',
    'Chọn BS',
    'Xác nhận',
];
const timeSlots = [
    { id: 1, time: '08:00 - 10:00', startTime: '08:00', endTime: '10:00' },
    { id: 2, time: '10:00 - 12:00', startTime: '10:00', endTime: '12:00' },
    { id: 3, time: '14:00 - 16:00', startTime: '14:00', endTime: '16:00' },
    { id: 4, time: '16:00 - 18:00', startTime: '16:00', endTime: '18:00' },
];

const specialties = [
    { specialtyId: 1, name: 'Tim mạch', description: 'Khám và điều trị các bệnh về tim mạch' },
    { specialtyId: 2, name: 'Nội khoa', description: 'Khám tổng quát và điều trị nội khoa' },
    { specialtyId: 3, name: 'Ngoại khoa', description: 'Phẫu thuật và điều trị ngoại khoa' },
    { specialtyId: 4, name: 'Sản phụ khoa', description: 'Chăm sóc sức khỏe phụ nữ' },
    { specialtyId: 5, name: 'Nhi khoa', description: 'Khám và điều trị cho trẻ em' },
    { specialtyId: 6, name: 'Da liễu', description: 'Điều trị các bệnh về da' },
];

const doctors = [
    {
        userId: 1,
        fullName: 'Nguyễn Văn Hùng',
        phoneNumber: '0901111111',
        email: 'hung.nguyen@hospital.com',
        specialties: ['Tim mạch', 'Nội khoa'],
        avatar: null,
        experience: '15 năm kinh nghiệm',
    },
    {
        userId: 2,
        fullName: 'Trần Thị Mai',
        phoneNumber: '0902222222',
        email: 'mai.tran@hospital.com',
        specialties: ['Sản phụ khoa'],
        avatar: null,
        experience: '12 năm kinh nghiệm',
    },
];

export { stepTitles, stepTitlesMobile, timeSlots, specialties, doctors };
