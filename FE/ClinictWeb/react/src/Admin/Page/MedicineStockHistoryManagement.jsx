import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import FilterStockHistoryModal from '../Modal/FilterStockHistoryModal';
import { GetMedicineStockHistoryActionAsync } from '../../Redux/ReducerAPI/MedicineStockHistoryReducer';
import { formatDateTime, getNow, getStartOfCurrentMonth } from '../../Utils/Format/FormatDate';
import { pageSizeOptions } from '../../Utils/Data/DataExport';
import {
    getStockHistoryColor,
    getStockHistoryIcon,
    getStockHistoryTypeTranslate,
} from '../../Utils/Translate&FormatColor/MedicineStockUtil';
import { generatePaginationNumbers } from '../../Utils/GeneratePagination';

const MedicineStockHistoryManagement = () => {
    const dispatch = useDispatch();
    const { listStockHistory, totalPagesCount, totalItemsCount } = useSelector(
        state => state.MedicineStockHistoryReducer
    );
    const [filter, setFilter] = useState({
        search: '',
        type: '',
        sortBy: '',
        fromDate: getStartOfCurrentMonth(),
        toDate: getNow(),
        pageIndex: 1,
        pageSize: 5,
    });

    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    useEffect(() => {
        dispatch(GetMedicineStockHistoryActionAsync(filter));
    }, [filter, dispatch]);

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

    const handleApplyFilter = filters => {
        setFilter(prev => ({
            ...prev,
            search: filters.search,
            type: filters.type,
            sortBy: filters.sortBy,
            fromDate: filters.fromDate,
            toDate: filters.toDate,
            pageIndex: 1,
        }));
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (filter.search) count++;
        if (filter.type) count++;
        if (filter.sortBy) count++;
        if (filter.fromDate || filter.toDate) count++;
        return count;
    };

    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        Quản lý lịch sử tồn kho
                    </h1>
                    <p className="text-sm text-gray-500">Quản lý lịch sử nhập/xuất kho thuốc</p>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm lịch sử
                </Button>
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
                        {(filter.search ||
                            filter.type ||
                            filter.sortBy ||
                            filter.fromDate ||
                            filter.toDate) && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {filter.search && (
                                    <Badge variant="secondary" className="text-xs">
                                        Tìm kiếm: "{filter.search}"
                                    </Badge>
                                )}
                                {filter.type && (
                                    <Badge variant="secondary" className="text-xs">
                                        Loại: {getStockHistoryTypeTranslate(filter.type)}
                                    </Badge>
                                )}
                                {filter.sortBy && (
                                    <Badge variant="secondary" className="text-xs">
                                        Sắp xếp:{' '}
                                        {filter.sortBy === 'Descending' ? 'Giảm dần' : 'Tăng dần'}
                                    </Badge>
                                )}
                                {filter.fromDate && filter.toDate && (
                                    <Badge variant="secondary" className="text-xs">
                                        Từ ngày: {formatDateTime(filter.fromDate)} →{' '}
                                        {formatDateTime(filter.toDate)}
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Stock History Table Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-3">
                <div className="border-b border-gray-200 px-1 py-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Danh sách lịch sử tồn kho</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                            {totalItemsCount} bản ghi
                        </Badge>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Mã GD
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Ngày giờ
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Loại
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Thuốc
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Số lượng
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Người thực hiện
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Ghi chú
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {listStockHistory?.map(history => (
                                <tr
                                    key={history.medicineStockHistoryId}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div className="font-medium">{history.transactionCode}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {formatDateTime(history.creationDate)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <Badge
                                            className={`text-xs ${getStockHistoryColor(
                                                history.type
                                            )}`}
                                            variant="secondary"
                                        >
                                            {getStockHistoryIcon(history.type)}
                                            {getStockHistoryTypeTranslate(history.type)}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div className="font-medium">{history.medicineName}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {history.medicineCode}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {history.quantity}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {history.createdByName}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {history.note || 'Không có ghi chú'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600">
                        Hiển thị {(filter.pageIndex - 1) * filter.pageSize + 1} -{' '}
                        {Math.min(filter.pageIndex * filter.pageSize, totalItemsCount)} trong tổng
                        số {totalItemsCount} bản ghi
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

            {/* Modals */}
            <FilterStockHistoryModal
                open={isFilterModalOpen}
                onOpenChange={setIsFilterModalOpen}
                onApplyFilter={handleApplyFilter}
                currentFilters={{
                    search: filter.search,
                    type: filter.type,
                    sortBy: filter.sortBy,
                    fromDate: filter.fromDate,
                    toDate: filter.toDate,
                }}
            />
        </>
    );
};

export default MedicineStockHistoryManagement;
