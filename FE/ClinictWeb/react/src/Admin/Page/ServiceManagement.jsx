import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import {
    DeleteServiceActionAsync,
    GetServicesActionAsync,
} from '../../Redux/ReducerAPI/ServiceReducer';
import { useAsyncAction } from '../../Hooks/UseAsyncAction';
import AddServiceModal from '../Modal/AddServiceModal';
import { pageSizeOptions } from '../../Utils/Data/DataExport';
import { generatePaginationNumbers } from '../../Utils/GeneratePagination';

const ServiceManagement = () => {
    const dispatch = useDispatch();
    const { services, totalPagesCount, totalItemsCount } = useSelector(
        state => state.ServiceReducer
    );
    const [filter, setFilter] = useState({
        search: '',
        pageIndex: 1,
        pageSize: 5,
    });
    const [searchInput, setSearchInput] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { run } = useAsyncAction();

    useEffect(() => {
        dispatch(GetServicesActionAsync(filter));
    }, [filter, dispatch, services]);

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

    const handleDelete = (serviceId, filter) => {
        run(DeleteServiceActionAsync(serviceId, filter), () => {});
    };

    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Quản lý dịch vụ y tế</h1>
                    <p className="text-sm text-gray-500">Quản lý danh sách các dịch vụ y tế</p>
                </div>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm dịch vụ
                </Button>
            </div>

            {/* Search and Controls Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-3">
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="flex-1">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                type="text"
                                placeholder="Nhấn Enter để tìm kiếm dịch vụ..."
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

            {/* Services Table Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-3">
                <div className="border-b border-gray-200 px-1 py-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Danh sách dịch vụ</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                            {totalItemsCount} dịch vụ
                        </Badge>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Tên dịch vụ
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Giá (VNĐ)
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Mô tả
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {services?.map(service => (
                                <tr key={service.serviceId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {service.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-emerald-600">
                                        {service.price?.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {service.description}
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
                                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                                onClick={() => handleDelete(service.serviceId)}
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

            {/* Pagination Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600">
                        Hiển thị {(filter.pageIndex - 1) * filter.pageSize + 1} -{' '}
                        {Math.min(filter.pageIndex * filter.pageSize, totalItemsCount)} trong tổng
                        số {totalItemsCount} dịch vụ
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
            <AddServiceModal open={isModalOpen} onOpenChange={setIsModalOpen} />
        </>
    );
};

export default ServiceManagement;
