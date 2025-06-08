import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Search,
    Filter,
    CalendarIcon,
    Clock,
    User,
    Stethoscope,
    MapPin,
    Phone,
    MessageSquare,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { GetAppointmentActionAsync } from '../../Redux/ReducerAPI/AppointmentReducer';
import { GetSpecialtiesActionAsync } from '../../Redux/ReducerAPI/SpecialtyReducer';
import { generatePaginationNumbers } from '../../Utils/GeneratePagination';
import {
    appointmentStatuses,
    appointmentTabConfig,
    getStatusBadge,
    getStatusFromTabValue,
} from '../../Utils/Translate&FormatColor/StatusAppointmentUtil';
import FilterAppointmentModal from '../Modal/FilterAppointmentModal';
import { formatAppointmentDate } from '../../Utils/Format/FormatDate';

export default function AppointmentManagement() {
    const dispatch = useDispatch();
    const { appointments, totalPagesCount, totalItemsCount } = useSelector(
        state => state.AppointmentReducer
    );
    const { specialties } = useSelector(state => state.SpecialtyReducer);

    const [filter, setFilter] = useState({
        search: '',
        pageIndex: 1,
        pageSize: 5,
        startDate: '',
        endDate: '',
        sortBy: '',
        specialtyId: '',
        appointmentStatusEnum: '',
    });

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('');
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        dispatch(GetAppointmentActionAsync(filter));
        if (specialties.length === 0) {
            dispatch(GetSpecialtiesActionAsync());
        }
    }, [filter, dispatch]);

    const getActiveFilterCount = () => {
        let count = 0;
        if (filter.startDate) count++;
        if (filter.endDate) count++;
        if (filter.specialtyId) count++;
        if (filter.sortBy) count++;
        return count;
    };

    const handleApplyFilter = filters => {
        setFilter(prev => ({
            ...prev,
            ...filters,
            pageIndex: 1,
        }));
    };

    const handleSearchKeyDown = e => {
        if (e.key === 'Enter') {
            handleApplyFilter({ search: searchInput });
        }
    };

    const handleTabChange = tabValue => {
        const status = getStatusFromTabValue(tabValue);
        setFilter({
            search: '',
            pageIndex: 1,
            pageSize: 5,
            startDate: '',
            endDate: '',
            sortBy: '',
            specialtyId: '',
            appointmentStatusEnum: status,
        });
        setSearchInput('');
        setActiveTab(tabValue);
    };

    const handlePageChange = page => {
        setFilter(prev => ({
            ...prev,
            pageIndex: page,
        }));
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent mb-3">
                            Lịch khám của tôi
                        </h1>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-2xl font-bold text-sky-600">{totalItemsCount}</p>
                            <p className="text-sm text-gray-500">Tổng lịch hẹn</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-sky-100 p-6 mb-8">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                            placeholder="Tìm kiếm theo mã lịch hẹn, tên bác sĩ, chuyên khoa..."
                            value={searchInput}
                            onKeyDown={handleSearchKeyDown}
                            onChange={e => setSearchInput(e.target.value)}
                            className="pl-12 h-10 border-gray-200 focus:border-sky-400 focus:ring-sky-400 rounded-xl text-base"
                        />
                    </div>

                    <Button
                        variant="outline"
                        className="h-10 px-6 border-sky-200 text-sky-700 hover:bg-sky-50 hover:border-sky-300 rounded-xl font-medium relative"
                        onClick={() => setIsFilterOpen(true)}
                    >
                        <Filter className="h-5 w-5 mr-2" />
                        Bộ lọc nâng cao
                        {getActiveFilterCount() > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {getActiveFilterCount()}
                            </span>
                        )}
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 bg-white/80 backdrop-blur-sm rounded-xl p-1.5 shadow-sm border border-sky-100/50 h-auto min-h-12 gap-2">
                    {appointmentTabConfig.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className={`rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:${tab.gradientFrom} data-[state=active]:${tab.gradientTo} data-[state=active]:text-white font-medium text-xs sm:text-sm px-2 sm:px-3 py-2 transition-all duration-200 data-[state=active]:shadow-md`}
                            >
                                <Icon className="h-3.5 w-3.5 mr-1 sm:mr-1.5" />
                                <span className="truncate">{tab.label}</span>
                            </TabsTrigger>
                        );
                    })}
                </TabsList>

                <TabsContent value={activeTab} className="mt-8">
                    {/* Appointments Grid */}
                    <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8">
                        {appointments.length > 0 ? (
                            appointments.map(appointment => {
                                const statusConfig = getStatusBadge(appointment.status);
                                const StatusIcon = statusConfig.icon;

                                return (
                                    <Card
                                        key={appointment.appointmentId}
                                        className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md rounded-2xl overflow-hidden bg-white p-0"
                                    >
                                        <CardContent className="p-0">
                                            {/* Header with status */}
                                            <div
                                                className={`p-4 bg-gradient-to-r ${statusConfig.gradientColor} bg-opacity-10`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <Badge
                                                        className={`${statusConfig.color} border font-medium px-3 py-1 rounded-full`}
                                                    >
                                                        <StatusIcon className="h-3 w-3 mr-1" />
                                                        {statusConfig.label}
                                                    </Badge>
                                                    <span className="text-xs font-mono text-gray-500 bg-white px-2 py-1 rounded-md">
                                                        {appointment.appointmentCode}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-3 sm:p-4">
                                                {/* Doctor Info */}
                                                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                                                    <Avatar className="h-12 w-12 ring-2 ring-sky-100">
                                                        <AvatarImage
                                                            src={
                                                                appointment.doctorAvatar ||
                                                                '/placeholder.svg'
                                                            }
                                                            alt={appointment.doctorName}
                                                        />
                                                        <AvatarFallback className="bg-gradient-to-br from-sky-500 to-blue-600 text-white text-lg">
                                                            <User className="h-6 w-6" />
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-lg text-gray-900 mb-1">
                                                            {appointment.doctorName}
                                                        </h3>
                                                        <div className="flex items-center gap-1 text-sky-600">
                                                            <Stethoscope className="h-4 w-4" />
                                                            <span className="text-sm font-medium">
                                                                {appointment.specialtyName}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Appointment Details */}
                                                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                                                    <div className="flex items-center gap-3 text-gray-600">
                                                        <div className="flex items-center justify-center w-7 h-7 bg-sky-100 rounded-lg">
                                                            <CalendarIcon className="h-3.5 w-3.5 text-sky-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {formatAppointmentDate(
                                                                    appointment.appointmentDate
                                                                )}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                Ngày khám
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3 text-gray-600">
                                                        <div className="flex items-center justify-center w-7 h-7 bg-blue-100 rounded-lg">
                                                            <Clock className="h-3.5 w-3.5 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {appointment.startTime} -{' '}
                                                                {appointment.endTime}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                Thời gian
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3 text-gray-600">
                                                        <div className="flex items-center justify-center w-7 h-7 bg-green-100 rounded-lg">
                                                            <MapPin className="h-3.5 w-3.5 text-green-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {appointment.location}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                Địa điểm
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-1 sm:gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex-1 border-sky-200 text-sky-700 hover:bg-sky-50 rounded-xl font-medium"
                                                    >
                                                        <MessageSquare className="h-4 w-4 mr-2" />
                                                        Chi tiết
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="border-green-200 text-green-700 hover:bg-green-50 rounded-xl"
                                                    >
                                                        <Phone className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })
                        ) : (
                            <div className="col-span-full">
                                <Card className="rounded-2xl border-0 shadow-md">
                                    <CardContent className="p-6 sm:p-10 md:p-16 text-center">
                                        <div className="text-gray-300 mb-6">
                                            <CalendarIcon className="h-24 w-24 mx-auto" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                            Không có lịch hẹn nào
                                        </h3>
                                        <p className="text-gray-600 text-lg mb-6">
                                            {activeTab === 'all'
                                                ? 'Bạn chưa có lịch hẹn nào hoặc không có kết quả phù hợp với bộ lọc.'
                                                : `Không có lịch hẹn nào ở trạng thái "${
                                                      appointmentStatuses.find(
                                                          s => s.value === activeTab
                                                      )?.label
                                                  }".`}
                                        </p>
                                        <Button className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl px-8">
                                            Đặt lịch khám mới
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-sky-100 gap-4">
                        <div className="text-gray-600 text-sm sm:text-base text-center sm:text-left">
                            Hiển thị{' '}
                            <span className="font-semibold text-gray-900">
                                {(filter.pageIndex - 1) * filter.pageSize + 1} -{' '}
                                {Math.min(filter.pageIndex * filter.pageSize, totalItemsCount)}
                            </span>{' '}
                            trong tổng số{' '}
                            <span className="font-semibold text-gray-900">{totalItemsCount}</span>{' '}
                            kết quả
                        </div>

                        <div className="flex items-center gap-1 sm:gap-2">
                            {filter.pageIndex > 3 && (
                                <>
                                    <Button
                                        variant={1 === filter.pageIndex ? 'default' : 'outline'}
                                        size="sm"
                                        className={`rounded-xl min-w-[40px] ${
                                            1 === filter.pageIndex
                                                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white'
                                                : ''
                                        }`}
                                        onClick={() => handlePageChange(1)}
                                    >
                                        1
                                    </Button>
                                    {filter.pageIndex > 4 && (
                                        <span className="px-2 text-gray-400">...</span>
                                    )}
                                </>
                            )}

                            {generatePaginationNumbers(filter.pageIndex, totalPagesCount).map(
                                page => (
                                    <Button
                                        key={page}
                                        variant={page === filter.pageIndex ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => handlePageChange(page)}
                                        className={`rounded-xl min-w-[40px] ${
                                            page === filter.pageIndex
                                                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white'
                                                : ''
                                        }`}
                                    >
                                        {page}
                                    </Button>
                                )
                            )}

                            {filter.pageIndex < totalPagesCount - 2 && (
                                <>
                                    {filter.pageIndex < totalPagesCount - 3 && (
                                        <span className="px-2 text-gray-400">...</span>
                                    )}
                                    <Button
                                        variant={
                                            totalPagesCount === filter.pageIndex
                                                ? 'default'
                                                : 'outline'
                                        }
                                        size="sm"
                                        className={`rounded-xl min-w-[40px] ${
                                            totalPagesCount === filter.pageIndex
                                                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white'
                                                : ''
                                        }`}
                                        onClick={() => handlePageChange(totalPagesCount)}
                                    >
                                        {totalPagesCount}
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            <FilterAppointmentModal
                open={isFilterOpen}
                onOpenChange={setIsFilterOpen}
                onApplyFilter={handleApplyFilter}
                currentFilters={{
                    specialtyId: filter.specialtyId,
                    startDate: filter.startDate,
                    endDate: filter.endDate,
                    sortBy: filter.sortBy,
                }}
            />
        </div>
    );
}
