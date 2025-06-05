import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
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
import { getNow, getStartOfCurrentMonth } from '../../Utils/Format/FormatDate';
import { sortOptions, stockTypes } from '../../Utils/Data/DataExport';

const { RangePicker } = DatePicker;

const FilterStockHistoryModal = ({ open, onOpenChange, onApplyFilter, currentFilters }) => {
    const [filters, setFilters] = useState({
        search: '',
        type: '',
        sortBy: '',
        fromDate: '',
        toDate: '',
    });
    const [dateRange, setDateRange] = useState(
        currentFilters.fromDate && currentFilters.toDate
            ? [dayjs(currentFilters.fromDate), dayjs(currentFilters.toDate)]
            : [null, null]
    );

    useEffect(() => {
        if (open) {
            setFilters({
                search: currentFilters.search,
                type: currentFilters.type,
                sortBy: currentFilters.sortBy,
                fromDate: currentFilters.fromDate,
                toDate: currentFilters.toDate,
            });
            setDateRange(
                currentFilters.fromDate && currentFilters.toDate
                    ? [dayjs(currentFilters.fromDate), dayjs(currentFilters.toDate)]
                    : [null, null]
            );
        }
    }, [open, currentFilters]);

    const handleChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleDateRangeChange = dates => {
        setDateRange(dates || [null, null]);
        setFilters(prev => ({
            ...prev,
            fromDate: dates && dates[0] ? dates[0].format('YYYY-MM-DD HH:mm:ss') : '',
            toDate: dates && dates[1] ? dates[1].format('YYYY-MM-DD HH:mm:ss') : '',
        }));
    };

    const handleApply = () => {
        onApplyFilter(filters);
        onOpenChange(false);
    };

    const handleReset = () => {
        const resetFilters = {
            search: '',
            type: '',
            sortBy: '',
            fromDate: getStartOfCurrentMonth(),
            toDate: getNow(),
        };
        setFilters(resetFilters);
        setDateRange(
            resetFilters.fromDate && resetFilters.toDate
                ? [dayjs(resetFilters.fromDate), dayjs(resetFilters.toDate)]
                : [null, null]
        );
        onApplyFilter(resetFilters);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[90vw] sm:max-w-lg md:max-w-2xl lg:max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Bộ lọc lịch sử tồn kho
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4">
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

                            <div className="space-y-2">
                                <Label htmlFor="type">Loại</Label>
                                <Select
                                    value={filters.type}
                                    onValueChange={value => handleChange('type', value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Chọn loại" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {stockTypes.map(type => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

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
                        </div>

                        {/* Row 2: Date Range Picker (Full Width) */}
                        <div className="space-y-2">
                            <Label>Phạm vi ngày</Label>
                            <RangePicker
                                value={dateRange}
                                onChange={handleDateRangeChange}
                                showTime
                                format="DD/MM/YYYY HH:mm"
                                placeholder={['Từ ngày', 'Đến ngày']}
                                style={{ width: '100%', height: '40px' }}
                                allowClear
                            />
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

export default FilterStockHistoryModal;
