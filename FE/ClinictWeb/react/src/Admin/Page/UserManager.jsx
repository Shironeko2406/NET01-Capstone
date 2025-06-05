import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Filter, Plus, Edit, User } from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GetUsersActionAsync } from '../../Redux/ReducerAPI/UsersReducer';
import FilterUserModal from '../Modal/FilterUserModal';
import { formatDate } from '../../Utils/Format/FormatDate';
import {
    getGenderIcon,
    getRoleColor,
    getRoleTranslate,
} from '../../Utils/Translate&FormatColor/RoleUtil';
import { getGenderColor, getGenderTranslate } from '../../Utils/Translate&FormatColor/GenderUlti';
import { pageSizeOptions } from '../../Utils/Data/DataExport';

const UserManagement = () => {
    const dispatch = useDispatch();
    const { users, totalPagesCount, totalItemsCount } = useSelector(state => state.UsersReducer);

    const [filter, setFilter] = useState({
        search: '',
        role: '',
        pageIndex: 1,
        pageSize: 5,
    });

    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    useEffect(() => {
        dispatch(GetUsersActionAsync(filter));
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
            role: filters.role,
            pageIndex: 1,
        }));
    };

    // Generate pagination numbers
    const generatePaginationNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, filter.pageIndex - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPagesCount, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (filter.search) count++;
        if (filter.role) count++;
        return count;
    };

    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Quản lý người dùng</h1>
                    <p className="text-sm text-gray-500">Quản lý danh sách người dùng hệ thống</p>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm người dùng
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
                        {(filter.search || filter.role) && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {filter.search && (
                                    <Badge variant="secondary" className="text-xs">
                                        Tìm kiếm: "{filter.search}"
                                    </Badge>
                                )}
                                {filter.role && (
                                    <Badge variant="secondary" className="text-xs">
                                        Vai trò: {getRoleTranslate(filter.role)}
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Users Table Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-3">
                <div className="border-b border-gray-200 px-1 py-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Danh sách người dùng</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                            {totalItemsCount} người dùng
                        </Badge>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Người dùng
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Số điện thoại
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Giới tính
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Ngày sinh
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Vai trò
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users?.map(user => (
                                <tr key={user.userId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage
                                                    src={user.avatar || '/placeholder.svg'}
                                                    alt={user.fullName}
                                                />
                                                <AvatarFallback>
                                                    <User className="h-5 w-5" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.fullName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    @{user.username}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {user.phoneNumber}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge
                                            className={`text-xs ${getGenderColor(user.gender)}`}
                                            variant="secondary"
                                        >
                                            {getGenderIcon(user.gender)}
                                            {getGenderTranslate(user.gender)}
                                        </Badge>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {formatDate(user.dateOfBirth)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles?.map((role, index) => (
                                                <Badge
                                                    key={index}
                                                    className={`text-xs ${getRoleColor(role)}`}
                                                    variant="secondary"
                                                >
                                                    {getRoleTranslate(role)}
                                                </Badge>
                                            ))}
                                        </div>
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
                        số {totalItemsCount} người dùng
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
                        {generatePaginationNumbers().map(page => (
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
            <FilterUserModal
                open={isFilterModalOpen}
                onOpenChange={setIsFilterModalOpen}
                onApplyFilter={handleApplyFilter}
                currentFilters={{ search: filter.search, role: filter.role }}
            />
        </>
    );
};

export default UserManagement;
