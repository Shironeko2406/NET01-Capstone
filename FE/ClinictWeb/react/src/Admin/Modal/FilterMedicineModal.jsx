import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getMedicineStatusTranslate } from '../../Utils/Translate&FormatColor/MedicineUtil';
import { sortFieldOptions, sortOptions, statuses } from '../../Utils/Data/DataExport';
import { useSelector } from 'react-redux';

const FilterMedicineModal = ({ open, onOpenChange, onApplyFilter, currentFilters }) => {
    const { medicineTypes } = useSelector(state => state.MedicineTypeReducer);
    const [filters, setFilters] = useState({
        search: '',
        medicineTypeId: '',
        status: '',
        sortBy: '',
        sortField: '',
    });

    useEffect(() => {
        if (open) {
            setFilters(currentFilters);
        }
    }, [open, currentFilters]);

    const handleChange = (name, value) => {
        setFilters({ ...filters, [name]: value });
    };

    const handleApply = () => {
        onApplyFilter(filters);
        onOpenChange(false);
    };

    const handleReset = () => {
        const resetFilters = {
            search: '',
            medicineTypeId: '',
            status: '',
            sortBy: '',
            sortField: '',
        };
        setFilters(resetFilters);
        onApplyFilter(resetFilters);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[90vw] sm:max-w-lg md:max-w-2xl lg:max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Bộ lọc thuốc
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Filter Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Search Input */}
                        <div className="space-y-2">
                            <Label htmlFor="search">Tìm kiếm</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    id="search"
                                    value={filters.search}
                                    onChange={e => handleChange('search', e.target.value)}
                                    placeholder="Tìm theo tên, mã thuốc..."
                                    className="pl-10 w-full"
                                />
                            </div>
                        </div>

                        {/* Medicine Type Filter */}
                        <div className="space-y-2">
                            <Label htmlFor="medicineTypeId">Loại thuốc</Label>
                            <Select
                                value={filters.medicineTypeId}
                                onValueChange={value => handleChange('medicineTypeId', value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn loại thuốc" />
                                </SelectTrigger>
                                <SelectContent>
                                    {medicineTypes.map(type => (
                                        <SelectItem
                                            key={type.medicineTypeId}
                                            value={type.medicineTypeId}
                                        >
                                            {type.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Status Filter */}
                        <div className="space-y-2">
                            <Label htmlFor="status">Trạng thái</Label>
                            <Select
                                value={filters.status}
                                onValueChange={value => handleChange('status', value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statuses.map(status => (
                                        <SelectItem key={status} value={status}>
                                            {getMedicineStatusTranslate(status)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Sort By Filter */}
                        <div className="space-y-2">
                            <Label htmlFor="sortBy">Sắp xếp theo</Label>
                            <Select
                                value={filters.sortBy}
                                onValueChange={value => handleChange('sortBy', value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn thứ tự" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sortOptions.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Sort Field Filter */}
                        <div className="space-y-2">
                            <Label htmlFor="sortField">Sắp xếp theo</Label>
                            <Select
                                value={filters.sortField}
                                onValueChange={value => handleChange('sortField', value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn trường" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sortFieldOptions.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={handleReset}>
                            Đặt lại
                        </Button>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="button"
                                className="bg-emerald-600 hover:bg-emerald-700"
                                onClick={handleApply}
                            >
                                Áp dụng
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FilterMedicineModal;
