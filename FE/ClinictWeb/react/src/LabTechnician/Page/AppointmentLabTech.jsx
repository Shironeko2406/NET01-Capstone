import { useEffect } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Calendar, Filter, MoreVertical, Eye, Users, Activity, BarChart3 } from 'lucide-react';
import { GetAppointmentForLabTechActionAsync } from '../../Redux/ReducerAPI/AppointmentReducer';
import { useDispatch, useSelector } from 'react-redux';
import { pageSizeOptions } from '../../Utils/Data/DataExport';
import { generatePaginationNumbers } from '../../Utils/GeneratePagination';
import {
    getAppointmentStatusColor,
    getAppointmentStatusTranslate,
} from '../../Utils/Translate&FormatColor/AppointmentUtil';
import { formatAppointmentDate, formatDate } from '../../Utils/Format/FormatDate';
import { GetAppointmentStatisticActionAsync } from '../../Redux/ReducerAPI/StatisticReducer';
import FilterAppointmentModal from '../Modal/FilterAppointmentModal';
import { useNavigate } from 'react-router-dom';
import AppointmentTabList from '../Components/AppointmentTabList';
import {
    getLabTestStatusColor,
    getLabTestStatusTranslate,
} from '../../Utils/Translate&FormatColor/LabTestStatusUtil';
import { calculateLabTestProgress } from '../../Utils/CalculateLabTestProgress';

const AppointmentLabTech = () => {
    const [activeTab, setActiveTab] = useState('');
    const [filter, setFilter] = useState({
        search: '',
        appointmentDate: '',
        status: '',
        pageIndex: 1,
        pageSize: 10,
    });
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const dispatch = useDispatch();
    const { appointments, totalPagesCount, totalItemsCount } = useSelector(
        state => state.AppointmentReducer
    );
    const { appointmentStatistic } = useSelector(state => state.StatisticReducer);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(GetAppointmentForLabTechActionAsync(filter));
        if (!appointmentStatistic) {
            dispatch(GetAppointmentStatisticActionAsync());
        }
    }, [filter]);

    const handleApplyFilter = filters => {
        setFilter(prev => ({
            ...prev,
            ...filters,
            pageIndex: 1,
        }));
    };

    // Get active filters count
    const getActiveFiltersCount = () => {
        let count = 0;
        if (filter.search) count++;
        if (filter.appointmentDate) count++;
        return count;
    };

    const handleTabChange = tabValue => {
        console.log(tabValue);
        setFilter({
            search: '',
            appointmentDate: '',
            status: tabValue,
            pageIndex: 1,
            pageSize: 10,
        });
        setActiveTab(tabValue);
    };

    const handlePageChange = page => {
        setFilter(prev => ({
            ...prev,
            pageIndex: page,
        }));
    };

    const handlePageSizeChange = size => {
        setFilter(prev => ({
            ...prev,
            pageSize: Number(size),
            pageIndex: 1,
        }));
    };

    return (
        <>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Quản lý Xét nghiệm</h1>
                    <p className="text-sm text-gray-500">
                        Quản lý và theo dõi tất cả các cuộc hẹn xét nghiệm
                    </p>
                </div>
            </div>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow h-25">
                    <CardContent className="p-4 flex items-center h-full">
                        <div className="flex items-center justify-between w-full">
                            <div className="space-y-0.5">
                                <p className="text-sm font-medium text-gray-500">
                                    Tổng số lịch hẹn
                                </p>
                                <p className="text-2xl font-bold">{appointmentStatistic?.total}</p>
                            </div>
                            <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
                                <Calendar className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow h-25">
                    <CardContent className="p-4 flex items-center h-full">
                        <div className="flex items-center justify-between w-full">
                            <div className="space-y-0.5">
                                <p className="text-sm font-medium text-gray-500">
                                    Lịch hẹn hôm nay
                                </p>
                                <p className="text-2xl font-bold">
                                    {appointmentStatistic?.todayCount}
                                </p>
                            </div>
                            <div className="h-12 w-12 bg-emerald-50 rounded-full flex items-center justify-center">
                                <Activity className="h-6 w-6 text-emerald-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow h-25">
                    <CardContent className="p-4 flex items-center h-full">
                        <div className="flex items-center justify-between w-full">
                            <div className="space-y-0.5">
                                <p className="text-sm font-medium text-gray-500">Bệnh nhân</p>
                                <p className="text-2xl font-bold">
                                    {appointmentStatistic?.patientCount}
                                </p>
                            </div>
                            <div className="h-12 w-12 bg-amber-50 rounded-full flex items-center justify-center">
                                <Users className="h-6 w-6 text-amber-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow h-25">
                    <CardContent className="p-4 flex items-center h-full">
                        <div className="flex items-center justify-between w-full">
                            <div className="space-y-0.5">
                                <p className="text-sm font-medium text-gray-500">
                                    Tỷ lệ hoàn thành
                                </p>
                                <p className="text-2xl font-bold">
                                    {appointmentStatistic?.completionRate}%
                                </p>
                            </div>
                            <div className="h-12 w-12 bg-purple-50 rounded-full flex items-center justify-center">
                                <BarChart3 className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter and Controls Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-3">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                            <div className="flex-shrink-0">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsFilterModalOpen(true)}
                                    className="w-full sm:w-auto relative"
                                >
                                    <Filter className="w-4 h-4 mr-2" />
                                    Áp dụng bộ lọc
                                    {getActiveFiltersCount() > 0 && (
                                        <Badge className="ml-2 bg-emerald-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                                            {getActiveFiltersCount()}
                                        </Badge>
                                    )}
                                </Button>
                            </div>

                            <div className="flex items-center gap-2 sm:ml-auto">
                                <span className="text-sm text-gray-600 whitespace-nowrap">
                                    Hiển thị:
                                </span>
                                <Select
                                    value={filter.pageSize.toString()}
                                    onValueChange={handlePageSizeChange}
                                >
                                    <SelectTrigger className="w-20 h-10">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {pageSizeOptions.map(size => (
                                            <SelectItem key={size} value={size}>
                                                {size}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Active Filters Display */}
                        {(filter.search || filter.appointmentDate) && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {filter.search && (
                                    <Badge variant="secondary" className="text-xs">
                                        Tìm kiếm: {filter.search}
                                    </Badge>
                                )}
                                {filter.appointmentDate && (
                                    <Badge variant="secondary" className="text-xs">
                                        Ngày hẹn: {formatDate(filter.appointmentDate)}
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs and Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
                <div className="p-4">
                    <Tabs defaultValue="" value={activeTab} onValueChange={handleTabChange}>
                        {/* Responsive Tabs */}
                        <div className="w-full">
                            <AppointmentTabList />
                        </div>

                        <TabsContent value={activeTab} className="mt-4 overflow-hidden">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-3">
                                <div className="border-b border-gray-200 px-1 py-4">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base">
                                            Danh sách lịch hẹn xét nghiệm
                                        </CardTitle>
                                        <Badge variant="secondary" className="text-xs">
                                            {totalItemsCount} lịch hẹn
                                        </Badge>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-[1000px] w-full table-auto">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                                    Mã lịch hẹn
                                                </th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                                    Bệnh nhân
                                                </th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                                    Ngày & giờ
                                                </th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                                    Trạng thái
                                                </th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                                    Tiến độ xét nghiệm
                                                </th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                                    Trạng thái XN
                                                </th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                                                    Thao tác
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {appointments.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={7}
                                                        className="px-6 py-8 text-center text-gray-500"
                                                    >
                                                        <div className="flex flex-col items-center justify-center">
                                                            <Calendar className="h-12 w-12 text-gray-300 mb-2" />
                                                            <p>Không tìm thấy lịch hẹn nào</p>
                                                            <p className="text-sm">
                                                                Vui lòng thử lại với bộ lọc khác
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                appointments.map(appointment => {
                                                    const progress = calculateLabTestProgress(
                                                        appointment.services
                                                    );
                                                    return (
                                                        <tr
                                                            key={appointment.appointmentId}
                                                            className="hover:bg-gray-50"
                                                        >
                                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                                {appointment.appointmentCode}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                                <div className="font-medium">
                                                                    {appointment.patientName}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {appointment.phoneNumber}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                                <div className="font-medium">
                                                                    {formatAppointmentDate(
                                                                        appointment.appointmentDate
                                                                    )}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {appointment.startTime} -{' '}
                                                                    {appointment.endTime}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <Badge
                                                                    className={getAppointmentStatusColor(
                                                                        appointment.status
                                                                    )}
                                                                    variant="secondary"
                                                                >
                                                                    {getAppointmentStatusTranslate(
                                                                        appointment.status
                                                                    )}
                                                                </Badge>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <Progress
                                                                            value={
                                                                                progress.percentage
                                                                            }
                                                                            className="flex-1 h-2"
                                                                        />
                                                                        <span className="text-xs font-medium text-gray-600 min-w-[35px]">
                                                                            {progress.percentage}%
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">
                                                                        {progress.completed}/
                                                                        {progress.total} hoàn thành
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <Badge
                                                                    className={getLabTestStatusColor(
                                                                        appointment.labTestStatus
                                                                    )}
                                                                    variant="secondary"
                                                                >
                                                                    {getLabTestStatusTranslate(
                                                                        appointment.labTestStatus
                                                                    )}
                                                                </Badge>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center justify-center gap-1">
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger
                                                                            asChild
                                                                        >
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                className="h-8 w-8 p-0"
                                                                            >
                                                                                <MoreVertical className="h-4 w-4" />
                                                                            </Button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent align="end">
                                                                            <DropdownMenuLabel>
                                                                                Thao tác
                                                                            </DropdownMenuLabel>
                                                                            <DropdownMenuItem
                                                                                onClick={() =>
                                                                                    navigate(
                                                                                        `/labTech/appointment/${appointment.appointmentId}/labService`
                                                                                    )
                                                                                }
                                                                            >
                                                                                <Eye className="mr-2 h-4 w-4" />
                                                                                Xem chi tiết
                                                                            </DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Pagination */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600">
                        Hiển thị {(filter.pageIndex - 1) * filter.pageSize + 1} -{' '}
                        {Math.min(filter.pageIndex * filter.pageSize, totalItemsCount)} trong tổng
                        số {totalItemsCount} lịch hẹn
                    </div>

                    <div className="flex items-center gap-1">
                        {/* First page */}
                        {filter.pageIndex > 3 && (
                            <>
                                <Button
                                    variant={1 === filter.pageIndex ? 'default' : 'outline'}
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => handlePageChange(1)}
                                >
                                    1
                                </Button>
                                {filter.pageIndex > 4 && (
                                    <span className="px-2 text-gray-400">...</span>
                                )}
                            </>
                        )}

                        {/* Page numbers */}
                        {generatePaginationNumbers(filter.pageIndex, totalPagesCount).map(page => (
                            <Button
                                key={page}
                                variant={page === filter.pageIndex ? 'default' : 'outline'}
                                size="sm"
                                className={`h-8 w-8 p-0 ${
                                    page === filter.pageIndex ? 'bg-gray-900 text-white' : ''
                                }`}
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </Button>
                        ))}

                        {/* Last page */}
                        {filter.pageIndex < totalPagesCount - 2 && (
                            <>
                                {filter.pageIndex < totalPagesCount - 3 && (
                                    <span className="px-2 text-gray-400">...</span>
                                )}
                                <Button
                                    variant={
                                        totalPagesCount === filter.pageIndex ? 'default' : 'outline'
                                    }
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => handlePageChange(totalPagesCount)}
                                >
                                    {totalPagesCount}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <FilterAppointmentModal
                open={isFilterModalOpen}
                onOpenChange={setIsFilterModalOpen}
                onApplyFilter={handleApplyFilter}
                currentFilters={{
                    search: filter.search,
                    appointmentDate: filter.appointmentDate,
                }}
            />
        </>
    );
};

export default AppointmentLabTech;
