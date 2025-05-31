import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
    BarChart3,
    Home,
    LayoutDashboard,
    Settings,
    Users,
    X,
    ChevronDown,
    Calendar,
    Pill,
    FileHeart,
    UserCheck,
    Stethoscope,
    Activity,
    CreditCard,
    Bell,
    Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const menuItems = [
    { icon: Home, label: 'Trang chủ', href: '/', active: true },
    {
        icon: LayoutDashboard,
        label: 'Bảng điều khiển',
        href: '/dashboard',
        badge: '3',
    },
    {
        icon: Users,
        label: 'Quản lý bệnh nhân',
        badge: '24',
        submenu: [
            { label: 'Danh sách bệnh nhân', href: '/patients', badge: '156' },
            { label: 'Thêm bệnh nhân mới', href: '/patients/new', new: true },
            { label: 'Lịch sử khám bệnh', href: '/patients/history' },
            { label: 'Bệnh nhân VIP', href: '/patients/vip', badge: '12' },
        ],
    },
    {
        icon: Stethoscope,
        label: 'Khám bệnh',
        submenu: [
            { label: 'Phòng khám 1', href: '/examination/room1', badge: '3' },
            { label: 'Phòng khám 2', href: '/examination/room2', badge: '1' },
            {
                label: 'Phòng cấp cứu',
                href: '/examination/emergency',
                badge: '!',
            },
            { label: 'Kết quả xét nghiệm', href: '/examination/results' },
        ],
    },
    {
        icon: FileHeart,
        label: 'Hồ sơ y tế',
        submenu: [
            { label: 'Tất cả hồ sơ', href: '/medical-records' },
            { label: 'Tạo hồ sơ mới', href: '/medical-records/new' },
            {
                label: 'Hồ sơ cần duyệt',
                href: '/medical-records/pending',
                badge: '7',
            },
            { label: 'Lưu trữ', href: '/medical-records/archive' },
        ],
    },
    {
        icon: Calendar,
        label: 'Lịch hẹn & Đặt khám',
        badge: '15',
        submenu: [
            { label: 'Lịch hôm nay', href: '/appointments/today', badge: '8' },
            { label: 'Lịch tuần này', href: '/appointments/week', badge: '23' },
            { label: 'Đặt lịch mới', href: '/appointments/new', new: true },
            { label: 'Lịch hẹn đã hủy', href: '/appointments/cancelled' },
        ],
    },
    {
        icon: Pill,
        label: 'Nhà thuốc',
        submenu: [
            { label: 'Kho thuốc', href: '/pharmacy/inventory', badge: '245' },
            { label: 'Đơn thuốc', href: '/pharmacy/prescriptions' },
            {
                label: 'Thuốc sắp hết',
                href: '/pharmacy/low-stock',
                badge: '12',
            },
            { label: 'Nhập kho', href: '/pharmacy/import' },
            { label: 'Xuất kho', href: '/pharmacy/export' },
        ],
    },
    {
        icon: CreditCard,
        label: 'Thanh toán',
        submenu: [
            { label: 'Hóa đơn chờ', href: '/billing/pending', badge: '5' },
            { label: 'Đã thanh toán', href: '/billing/paid' },
            { label: 'Quá hạn', href: '/billing/overdue', badge: '2' },
            { label: 'Báo cáo doanh thu', href: '/billing/revenue' },
        ],
    },
    {
        icon: BarChart3,
        label: 'Báo cáo & Thống kê',
        submenu: [
            { label: 'Tổng quan', href: '/reports/overview' },
            { label: 'Doanh thu', href: '/reports/revenue' },
            { label: 'Bệnh nhân', href: '/reports/patients' },
            { label: 'Hiệu suất', href: '/reports/performance' },
            { label: 'Xuất báo cáo', href: '/reports/export' },
        ],
    },
    {
        icon: Settings,
        label: 'Cài đặt hệ thống',
        submenu: [
            { label: 'Cài đặt chung', href: '/settings/general' },
            { label: 'Người dùng', href: '/settings/users' },
            { label: 'Phân quyền', href: '/settings/permissions' },
            { label: 'Sao lưu', href: '/settings/backup' },
        ],
    },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
    const [expandedItems, setExpandedItems] = useState([1]);
    const [searchQuery, setSearchQuery] = useState('');

    const toggleExpanded = index => {
        setExpandedItems(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const filteredMenuItems = menuItems.filter(
        item =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.submenu?.some(sub =>
                sub.label.toLowerCase().includes(searchQuery.toLowerCase())
            )
    );

    return (
        <>
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 flex flex-col bg-gradient-to-b from-emerald-900 via-emerald-800 to-teal-800 shadow-2xl transition-all duration-300 ease-in-out md:relative border-r border-emerald-700/50',
                    isOpen
                        ? 'w-64 translate-x-0'
                        : 'w-16 -translate-x-full md:translate-x-0'
                )}
            >
                {/* Header with logo */}
                <div className="flex h-14 items-center border-b border-emerald-700/50 px-3 bg-emerald-900/50">
                    <Link
                        href="/"
                        className="flex items-center min-w-0 group w-full"
                    >
                        <div
                            className={cn(
                                'flex items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 shadow-md flex-shrink-0 group-hover:scale-105 transition-transform duration-200',
                                isOpen ? 'h-8 w-8' : 'h-8 w-8 mx-auto'
                            )}
                        >
                            <Stethoscope size={18} className="text-white" />
                        </div>
                        <div
                            className={cn(
                                'ml-2 transition-all duration-300 overflow-hidden',
                                isOpen
                                    ? 'opacity-100 translate-x-0 w-auto'
                                    : 'opacity-0 -translate-x-2 w-0 md:opacity-0 md:w-0'
                            )}
                        >
                            <h1 className="text-sm font-bold text-white whitespace-nowrap">
                                MediCare Pro
                            </h1>
                            <p className="text-xs text-emerald-200 whitespace-nowrap font-medium">
                                Clinic Management
                            </p>
                        </div>
                    </Link>

                    {/* Close button for mobile only */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-emerald-700/50 md:hidden flex-shrink-0 rounded-md h-7 w-7 ml-2"
                        onClick={() => setIsOpen(false)}
                    >
                        <X size={16} />
                    </Button>
                </div>

                {/* Search bar - restored */}
                {isOpen && (
                    <div className="p-3 border-b border-emerald-700/50">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-emerald-300" />
                            <Input
                                type="search"
                                placeholder="Tìm kiếm..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full border-emerald-600 bg-emerald-800/50 pl-8 text-sm text-white placeholder:text-emerald-300 focus:border-emerald-400 focus:ring-emerald-400 h-8"
                            />
                        </div>
                    </div>
                )}

                {/* Quick stats */}
                {isOpen && (
                    <div className="p-3 border-b border-emerald-700/50">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-emerald-800/50 rounded-md p-2 text-center">
                                <div className="text-sm font-bold text-white">
                                    24
                                </div>
                                <div className="text-xs text-emerald-200">
                                    Hôm nay
                                </div>
                            </div>
                            <div className="bg-teal-800/50 rounded-md p-2 text-center">
                                <div className="text-sm font-bold text-white">
                                    156
                                </div>
                                <div className="text-xs text-teal-200">
                                    Tổng BN
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-2 scrollbar-hide">
                    <ul className="space-y-1">
                        {filteredMenuItems.map((item, index) => (
                            <li key={index}>
                                {item.submenu ? (
                                    <div>
                                        <button
                                            onClick={() =>
                                                isOpen && toggleExpanded(index)
                                            }
                                            className={cn(
                                                'group flex w-full items-center rounded-lg text-emerald-100 transition-all duration-200 hover:bg-emerald-700/50 hover:text-white hover:shadow-md relative text-sm',
                                                !isOpen && 'justify-center p-2',
                                                isOpen && 'px-2.5 py-2',
                                                expandedItems.includes(index) &&
                                                    isOpen &&
                                                    'bg-emerald-700/30'
                                            )}
                                            title={
                                                !isOpen ? item.label : undefined
                                            }
                                        >
                                            <div
                                                className={cn(
                                                    'flex items-center justify-center flex-shrink-0',
                                                    isOpen
                                                        ? 'h-5 w-5'
                                                        : 'h-6 w-6'
                                                )}
                                            >
                                                <item.icon size={16} />
                                            </div>
                                            <span
                                                className={cn(
                                                    'ml-2.5 font-medium transition-all duration-300 flex-1 text-left overflow-hidden whitespace-nowrap',
                                                    isOpen
                                                        ? 'opacity-100 translate-x-0 w-auto'
                                                        : 'opacity-0 -translate-x-2 w-0 md:opacity-0 md:w-0'
                                                )}
                                            >
                                                {item.label}
                                            </span>
                                            {isOpen && item.badge && (
                                                <Badge
                                                    variant="secondary"
                                                    className="ml-1.5 bg-emerald-500 text-white text-xs px-1.5 py-0 flex-shrink-0 h-4"
                                                >
                                                    {item.badge}
                                                </Badge>
                                            )}
                                            {isOpen && (
                                                <ChevronDown
                                                    size={14}
                                                    className={cn(
                                                        'transition-transform duration-200 flex-shrink-0 ml-1.5',
                                                        expandedItems.includes(
                                                            index
                                                        ) && 'rotate-180'
                                                    )}
                                                />
                                            )}
                                        </button>

                                        {/* Submenu */}
                                        {isOpen &&
                                            expandedItems.includes(index) && (
                                                <ul className="mt-1 ml-5 space-y-0.5 animate-in slide-in-from-top-2 duration-200">
                                                    {item.submenu.map(
                                                        (subItem, subIndex) => (
                                                            <li key={subIndex}>
                                                                <Link
                                                                    href={
                                                                        subItem.href
                                                                    }
                                                                    className="flex items-center rounded-md px-2.5 py-1.5 text-xs text-emerald-200 transition-all duration-200 hover:bg-emerald-700/50 hover:text-white hover:translate-x-1 group"
                                                                    onClick={() => {
                                                                        if (
                                                                            window.innerWidth <
                                                                            768
                                                                        ) {
                                                                            setIsOpen(
                                                                                false
                                                                            );
                                                                        }
                                                                    }}
                                                                >
                                                                    <div className="h-1 w-1 rounded-full bg-emerald-400 mr-2.5 flex-shrink-0 group-hover:bg-white transition-colors"></div>
                                                                    <span className="truncate flex-1">
                                                                        {
                                                                            subItem.label
                                                                        }
                                                                    </span>
                                                                    {subItem.new && (
                                                                        <Badge className="ml-1.5 bg-orange-500 text-white text-xs px-1 py-0 h-3.5">
                                                                            New
                                                                        </Badge>
                                                                    )}
                                                                    {subItem.badge && (
                                                                        <Badge
                                                                            variant="secondary"
                                                                            className={cn(
                                                                                'ml-1.5 text-xs px-1 py-0 h-3.5',
                                                                                subItem.badge ===
                                                                                    '!'
                                                                                    ? 'bg-red-500 text-white animate-pulse'
                                                                                    : 'bg-emerald-500 text-white'
                                                                            )}
                                                                        >
                                                                            {
                                                                                subItem.badge
                                                                            }
                                                                        </Badge>
                                                                    )}
                                                                </Link>
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            )}
                                    </div>
                                ) : (
                                    <Link
                                        className={cn(
                                            'group flex items-center rounded-lg text-emerald-100 transition-all duration-200 hover:bg-emerald-700/50 hover:text-white hover:shadow-md relative text-sm',
                                            item.active &&
                                                'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md',
                                            !isOpen && 'justify-center p-2',
                                            isOpen && 'px-2.5 py-2'
                                        )}
                                        onClick={() => {
                                            if (window.innerWidth < 768) {
                                                setIsOpen(false);
                                            }
                                        }}
                                        title={!isOpen ? item.label : undefined}
                                    >
                                        <div
                                            className={cn(
                                                'flex items-center justify-center flex-shrink-0',
                                                isOpen ? 'h-5 w-5' : 'h-6 w-6'
                                            )}
                                        >
                                            <item.icon size={16} />
                                        </div>
                                        <span
                                            className={cn(
                                                'ml-2.5 font-medium transition-all duration-300 overflow-hidden whitespace-nowrap flex-1',
                                                isOpen
                                                    ? 'opacity-100 translate-x-0 w-auto'
                                                    : 'opacity-0 -translate-x-2 w-0 md:opacity-0 md:w-0'
                                            )}
                                        >
                                            {item.label}
                                        </span>
                                        {isOpen && item.badge && (
                                            <Badge
                                                variant="secondary"
                                                className="ml-1.5 bg-emerald-500 text-white text-xs px-1.5 py-0 flex-shrink-0 h-4"
                                            >
                                                {item.badge}
                                            </Badge>
                                        )}
                                        {item.active && isOpen && (
                                            <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white flex-shrink-0"></div>
                                        )}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Footer with user info and quick actions */}
                <div className="border-t border-emerald-700/50 bg-emerald-900/50">
                    {/* Quick actions - only when open */}
                    {isOpen && (
                        <div className="p-2 border-b border-emerald-700/50">
                            <div className="flex gap-1">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="flex-1 text-emerald-200 hover:bg-emerald-700/50 hover:text-white text-xs h-7 px-2"
                                >
                                    <Bell size={12} className="mr-1" />
                                    Thông báo
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="flex-1 text-emerald-200 hover:bg-emerald-700/50 hover:text-white text-xs h-7 px-2"
                                >
                                    <Activity size={12} className="mr-1" />
                                    Hoạt động
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* User profile */}
                    <div className="p-3">
                        <div
                            className={cn(
                                'flex items-center transition-all duration-300',
                                isOpen
                                    ? 'opacity-100'
                                    : 'opacity-0 md:opacity-0'
                            )}
                        >
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-md">
                                <UserCheck size={14} className="text-white" />
                            </div>
                            <div
                                className={cn(
                                    'ml-2.5 overflow-hidden transition-all duration-300',
                                    isOpen
                                        ? 'w-auto opacity-100'
                                        : 'w-0 opacity-0'
                                )}
                            >
                                <p className="text-xs font-semibold text-white whitespace-nowrap">
                                    Dr. Nguyễn Văn A
                                </p>
                                <p className="text-xs text-emerald-200 whitespace-nowrap">
                                    Bác sĩ chuyên khoa Tim mạch
                                </p>
                                <div className="flex items-center mt-0.5">
                                    <div className="h-1.5 w-1.5 rounded-full bg-green-400 mr-1.5"></div>
                                    <span className="text-xs text-emerald-300">
                                        Đang hoạt động
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
