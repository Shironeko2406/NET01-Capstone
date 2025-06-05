import {
    Heart,
    Stethoscope,
    Calendar,
    Users,
    FileText,
    Phone,
    Settings,
    Shield,
} from 'lucide-react';

export const navigationData = [
    {
        title: 'Tính năng',
        href: '#features',
        icon: Heart,
        subItems: [
            {
                title: 'Đặt lịch khám',
                href: '#appointment',
                description: 'Đặt lịch và quản lý cuộc hẹn dễ dàng',
                icon: Calendar,
            },
            {
                title: 'Hồ sơ y tế',
                href: '#medical-records',
                description: 'Lưu trữ và quản lý hồ sơ bệnh án điện tử',
                icon: FileText,
            },
        ],
    },
    {
        title: 'Dịch vụ',
        href: '#services',
        icon: Stethoscope,
        subItems: [
            {
                title: 'Chuyên khoa',
                href: '#specialist',
                description: 'Các dịch vụ chuyên khoa chuyên sâu',
                icon: Stethoscope,
            },
            {
                title: 'Xét nghiệm',
                href: '#laboratory',
                description: 'Dịch vụ xét nghiệm và chẩn đoán',
                icon: FileText,
            },
        ],
    },
];

export const footerData = {
    brand: {
        name: 'MediCare Clinic',
        description:
            'Hệ thống quản lý phòng khám hiện đại, giúp nâng cao chất lượng dịch vụ y tế và tối ưu hóa quy trình làm việc.',
    },
    contact: {
        address: '123 Đường ABC, Quận 1, TP.HCM',
        phone: '(028) 1234 5678',
        email: 'info@mediclinic.vn',
        hours: 'Thứ 2 - Chủ nhật: 8:00 - 20:00',
    },
    sections: [
        {
            title: 'Sản phẩm',
            links: [
                { title: 'Tính năng', href: '#features' },
                { title: 'Bảng giá', href: '#pricing' },
                { title: 'Demo', href: '#demo' },
            ],
        },
        {
            title: 'Dịch vụ',
            links: [
                { title: 'Chuyên khoa', href: '#specialist' },
                { title: 'Xét nghiệm', href: '#laboratory' },
                { title: 'Đặt lịch khám', href: '#appointment' },
            ],
        },
        {
            title: 'Hỗ trợ',
            links: [
                { title: 'Trợ giúp', href: '#help' },
                { title: 'Câu hỏi thường gặp', href: '#faq' },
                { title: 'Liên hệ', href: '#contact' },
            ],
        },
    ],
    legal: [
        { title: 'Chính sách bảo mật', href: '#privacy' },
        { title: 'Điều khoản sử dụng', href: '#terms' },
    ],
};

export const brandData = {
    name: 'MediCare Clinic',
    tagline: 'Hệ thống quản lý phòng khám',
    logo: Heart,
};
