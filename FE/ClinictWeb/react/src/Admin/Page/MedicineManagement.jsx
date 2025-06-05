import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Filter, Plus, Edit } from 'lucide-react';
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
import FilterMedicineModal from '../Modal/FilterMedicineModal';
import { GetMedicinesActionAsync } from '../../Redux/ReducerAPI/MedicineReducer';
import { formatCurrency } from '../../Utils/Format/FormatCurrency';
import {
    getMedicineStatusColor,
    getMedicineStatusTranslate,
    getMedicineUnitTranslate,
    getSortFieldTranslate,
} from '../../Utils/Translate&FormatColor/MedicineUtil';
import { GetMedicineTypesActionAsync } from '../../Redux/ReducerAPI/MedicineTypeReducer';
import { pageSizeOptions } from '../../Utils/Data/DataExport';
import { generatePaginationNumbers } from '../../Utils/GeneratePagination';

const MedicineManagement = () => {
    const dispatch = useDispatch();
    const { medicines, totalPagesCount, totalItemsCount } = useSelector(
        state => state.MedicineReducer
    );
    const { medicineTypes } = useSelector(state => state.MedicineTypeReducer); // đổi tên slice
    const [filter, setFilter] = useState({
        search: '',
        medicineTypeId: '',
        status: '',
        pageIndex: 1,
        pageSize: 5,
        sortBy: '',
        sortField: '',
    });

    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    useEffect(() => {
        dispatch(GetMedicinesActionAsync(filter));
        if (medicineTypes.length === 0) {
            dispatch(GetMedicineTypesActionAsync());
        }
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
            medicineTypeId: filters.medicineTypeId,
            status: filters.status,
            sortBy: filters.sortBy,
            sortField: filters.sortField,
            pageIndex: 1,
        }));
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (filter.search) count++;
        if (filter.medicineTypeId) count++;
        if (filter.status) count++;
        if (filter.sortBy) count++;
        if (filter.sortField) count++;
        return count;
    };

    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Quản lý thuốc</h1>
                    <p className="text-sm text-gray-500">Quản lý danh sách thuốc trong hệ thống</p>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm thuốc
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
                            filter.medicineTypeId ||
                            filter.status ||
                            filter.sortBy ||
                            filter.sortField) && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {filter.search && (
                                    <Badge variant="secondary" className="text-xs">
                                        Tìm kiếm: "{filter.search}"
                                    </Badge>
                                )}
                                {filter.medicineTypeId && (
                                    <Badge variant="secondary" className="text-xs">
                                        Loại thuốc:{' '}
                                        {medicineTypes.find(
                                            type => type.medicineTypeId === filter.medicineTypeId
                                        )?.name || 'Không xác định'}
                                    </Badge>
                                )}

                                {filter.status && (
                                    <Badge variant="secondary" className="text-xs">
                                        Trạng thái: {getMedicineStatusTranslate(filter.status)}
                                    </Badge>
                                )}
                                {filter.sortBy && (
                                    <Badge variant="secondary" className="text-xs">
                                        Sắp xếp:{' '}
                                        {filter.sortBy === 'Descending' ? 'Giảm dần' : 'Tăng dần'}
                                    </Badge>
                                )}
                                {filter.sortField && (
                                    <Badge variant="secondary" className="text-xs">
                                        Sắp xếp theo: {getSortFieldTranslate(filter.sortField)}
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Medicines Table Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-3">
                <div className="border-b border-gray-200 px-1 py-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Danh sách thuốc</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                            {totalItemsCount} thuốc
                        </Badge>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Mã thuốc
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Tên thuốc
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Đơn vị
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Giá (VNĐ)
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Tồn kho
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {medicines?.map(medicine => (
                                <tr key={medicine.medicineId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {medicine.medicineCode}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div className="font-medium">{medicine.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {medicine.medicineTypeName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {getMedicineUnitTranslate(medicine.unit)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {formatCurrency(medicine.price)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div className="font-medium">{medicine.stockQuantity}</div>
                                        <div className="text-xs text-muted-foreground">
                                            Min: {medicine.minQuantity}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge
                                            className={`text-xs ${getMedicineStatusColor(
                                                medicine.status
                                            )}`}
                                            variant="secondary"
                                        >
                                            {getMedicineStatusTranslate(medicine.status)}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </div>
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
                        số {totalItemsCount} thuốc
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
            <FilterMedicineModal
                open={isFilterModalOpen}
                onOpenChange={setIsFilterModalOpen}
                onApplyFilter={handleApplyFilter}
                currentFilters={{
                    search: filter.search,
                    medicineTypeId: filter.medicineTypeId,
                    status: filter.status,
                    sortBy: filter.sortBy,
                    sortField: filter.sortField,
                }}
            />
        </>
    );
};

export default MedicineManagement;
