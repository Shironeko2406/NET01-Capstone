import {
    CalendarDays,
    Clock,
    Stethoscope,
    CheckCircle,
    XCircle,
    AlertCircle,
    CreditCard,
    Wallet,
} from 'lucide-react';

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
        value: 'PendingPayment',
        label: 'Đang chờ thanh toán',
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        gradientColor: 'from-orange-500',
        icon: Wallet,
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
        activeClass: 'data-[state=active]:bg-sky-500',
    },
    {
        value: 'Booked',
        label: 'Đã đặt',
        icon: CalendarDays,
        activeClass: 'data-[state=active]:bg-blue-500',
    },
    {
        value: 'Waiting',
        label: 'Chờ khám',
        icon: Clock,
        activeClass: 'data-[state=active]:bg-amber-500',
    },
    {
        value: 'InProgress',
        label: 'Đang khám',
        icon: Stethoscope,
        activeClass: 'data-[state=active]:bg-purple-500',
    },
    {
        value: 'PendingPayment',
        label: 'Chờ thanh toán',
        icon: CreditCard,
        activeClass: 'data-[state=active]:bg-orange-500',
    },
    {
        value: 'Completed',
        label: 'Hoàn thành',
        icon: CheckCircle,
        activeClass: 'data-[state=active]:bg-green-500',
    },
    {
        value: 'Cancelled',
        label: 'Đã hủy',
        icon: XCircle,
        activeClass: 'data-[state=active]:bg-red-500',
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

const getAppointmentStatusColor = status => {
    const colors = {
        booked: 'bg-green-500 text-white',
        waiting: 'bg-yellow-400 text-black',
        inprogress: 'bg-blue-500 text-white',
        pendingpayment: 'bg-orange-400 text-white',
        completed: 'bg-gray-600 text-white',
        cancelled: 'bg-red-500 text-white',
    };
    return colors[status?.toLowerCase()] || 'bg-gray-300 text-black';
};

const getAppointmentStatusTranslate = status => {
    const labels = {
        booked: 'Đã đặt lịch',
        waiting: 'Đang chờ khám',
        inprogress: 'Đang khám',
        pendingpayment: 'Đang chờ thanh toán',
        completed: 'Đã khám xong',
        cancelled: 'Đã hủy',
    };
    return labels[status?.toLowerCase()] || 'Không xác định';
};

export {
    getStatusBadge,
    appointmentStatuses,
    appointmentTabConfig,
    getAppointmentStatusColor,
    getAppointmentStatusTranslate,
};
