import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    DeleteMedicineTypeActionAsync,
    GetMedicineTypesActionAsync,
} from '../../Redux/ReducerAPI/MedicineTypeReducer';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import AddMedicineTypeModal from '../Modal/AddMedicineTypeModal';
import { useAsyncAction } from '../../Hooks/UseAsyncAction';
import { pageSizeOptions } from '../../Utils/Data/DataExport';
import { generatePaginationNumbers } from '../../Utils/GeneratePagination';

const MedicineTypeManagement = () => {
    const dispatch = useDispatch();
    const { medicineTypes } = useSelector(state => state.MedicineTypeReducer);
    const [filter, setFilter] = useState({
        search: '',
        pageIndex: 1,
        pageSize: 5,
    });
    const [searchInput, setSearchInput] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { run } = useAsyncAction();

    useEffect(() => {
        dispatch(GetMedicineTypesActionAsync());
    }, [dispatch]);

    const filteredData = useMemo(() => {
        let result = medicineTypes;
        if (filter.search) {
            result = result.filter(item =>
                item.name.toLowerCase().includes(filter.search.toLowerCase())
            );
        }
        return result;
    }, [medicineTypes, filter.search]);

    const paginatedData = useMemo(() => {
        const start = (filter.pageIndex - 1) * filter.pageSize;
        const end = start + filter.pageSize;
        return filteredData.slice(start, end);
    }, [filteredData, filter.pageIndex, filter.pageSize]);

    const totalPagesCount = Math.ceil(filteredData.length / filter.pageSize);

    const handleSearchSubmit = e => {
        e.preventDefault();
        setFilter(prev => ({
            ...prev,
            search: searchInput,
            pageIndex: 1,
        }));
    };

    const handleKeyPress = e => {
        if (e.key === 'Enter') {
            handleSearchSubmit(e);
        }
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

    const handleDelete = medicineTypeId => {
        run(DeleteMedicineTypeActionAsync(medicineTypeId), () => {});
    };

    return (
        <>
            <div className="flex items-center justify-between mb-1">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Quản lý loại thuốc</h1>
                    <p className="text-sm text-gray-500">Danh sách các loại thuốc hiện có</p>
                </div>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm loại thuốc
                </Button>
            </div>

            {/* Search + Filter */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-3">
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="flex-1">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                type="text"
                                placeholder="Nhấn Enter để tìm kiếm loại thuốc..."
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="pl-10 h-10 border-gray-300"
                            />
                        </form>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 whitespace-nowrap">Hiển thị:</span>
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
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-3">
                <div className="border-b border-gray-200 px-1 py-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Danh sách loại thuốc</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                            {filteredData.length} loại thuốc
                        </Badge>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Tên loại thuốc
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {paginatedData.map(medicineType => (
                                <tr key={medicineType.medicineTypeId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {medicineType.name}
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
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    handleDelete(medicineType.medicineTypeId)
                                                }
                                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600">
                        Hiển thị {(filter.pageIndex - 1) * filter.pageSize + 1} -{' '}
                        {Math.min(filter.pageIndex * filter.pageSize, filteredData.length)} trong
                        tổng số {filteredData.length} loại thuốc
                    </div>

                    <div className="flex items-center gap-1">
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

            <AddMedicineTypeModal open={isModalOpen} onOpenChange={setIsModalOpen} />
        </>
    );
};

export default MedicineTypeManagement;
