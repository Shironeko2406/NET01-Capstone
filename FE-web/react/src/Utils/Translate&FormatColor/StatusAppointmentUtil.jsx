import { CalendarDays, Clock, Stethoscope, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const appointmentStatuses = [
    {
        value: 'Booked',
        label: 'Đã đặt lịch',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        gradientColor: 'from-blue-500',
        icon: CalendarDays,
    },
    {
        value: 'Waiting',
        label: 'Đang chờ khám',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        gradientColor: 'from-yellow-500',
        icon: Clock,
    },
    {
        value: 'InProgress',
        label: 'Đang khám',
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        gradientColor: 'from-purple-500',
        icon: Stethoscope,
    },
    {
        value: 'Completed',
        label: 'Đã khám xong',
        color: 'bg-green-100 text-green-800 border-green-200',
        gradientColor: 'from-green-500',
        icon: CheckCircle,
    },
    {
        value: 'Cancelled',
        label: 'Đã hủy',
        color: 'bg-red-100 text-red-800 border-red-200',
        gradientColor: 'from-red-500',
        icon: XCircle,
    },
];

const appointmentTabConfig = [
    {
        value: '',
        label: 'Tất cả',
        icon: CalendarDays,
        gradientFrom: 'from-sky-500',
        gradientTo: 'to-blue-600',
    },
    {
        value: 'Booked',
        label: 'Đã đặt',
        icon: CalendarDays,
        gradientFrom: 'from-blue-500',
        gradientTo: 'to-blue-600',
    },
    {
        value: 'Waiting',
        label: 'Chờ khám',
        icon: Clock,
        gradientFrom: 'from-yellow-400',
        gradientTo: 'to-orange-500',
    },
    {
        value: 'InProgress',
        label: 'Đang khám',
        icon: Stethoscope,
        gradientFrom: 'from-purple-500',
        gradientTo: 'to-violet-600',
    },
    {
        value: 'Completed',
        label: 'Hoàn thành',
        icon: CheckCircle,
        gradientFrom: 'from-green-500',
        gradientTo: 'to-emerald-600',
    },
    {
        value: 'Cancelled',
        label: 'Đã hủy',
        icon: XCircle,
        gradientFrom: 'from-red-500',
        gradientTo: 'to-red-600',
    },
];

const getStatusBadge = status => {
    const statusConfig = appointmentStatuses.find(s => s.value === status);
    return (
        statusConfig || {
            label: status,
            color: 'bg-gray-100 text-gray-800 border-gray-200',
            icon: AlertCircle,
        }
    );
};

const getStatusFromTabValue = tabValue => {
    switch (tabValue) {
        case 'Booked':
            return 'Booked';
        case 'Waiting':
            return 'Waiting';
        case 'InProgress':
            return 'InProgress';
        case 'Completed':
            return 'Completed';
        case 'Cancelled':
            return 'Cancelled';
        default:
            return '';
    }
};

export { getStatusFromTabValue, getStatusBadge, appointmentStatuses, appointmentTabConfig };
