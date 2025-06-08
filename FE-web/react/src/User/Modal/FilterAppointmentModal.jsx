import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useSelector } from 'react-redux';
import { DatePicker } from 'antd';
import { sortOptions } from '../../Utils/Data/DataExport';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const FilterAppointmentModal = ({ open, onOpenChange, onApplyFilter, currentFilters }) => {
    const { specialties } = useSelector(state => state.SpecialtyReducer);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        sortBy: '',
        specialtyId: '',
    });
    const [dateRange, setDateRange] = useState([null, null]);

    useEffect(() => {
        if (open) {
            setFilters(currentFilters);
            setDateRange(
                currentFilters.startDate && currentFilters.endDate
                    ? [dayjs(currentFilters.startDate), dayjs(currentFilters.endDate)]
                    : [null, null]
            );
        }
    }, [open, currentFilters]);

    const handleChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleDateRangeChange = dates => {
        setDateRange(dates);
        setFilters(prev => ({
            ...prev,
            startDate: dates && dates[0] ? dates[0].format('YYYY-MM-DD') : '',
            endDate: dates && dates[1] ? dates[1].format('YYYY-MM-DD') : '',
        }));
    };

    const handleApply = () => {
        onApplyFilter(filters);
        onOpenChange(false);
    };

    const handleReset = () => {
        const resetFilters = {
            startDate: '',
            endDate: '',
            sortBy: '',
            specialtyId: '',
        };
        setFilters(resetFilters);
        setDateRange([null, null]);
        onApplyFilter(resetFilters);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                        Bộ lọc tìm kiếm
                    </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-4">
                    {/* Date Range */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700">Thời gian</Label>
                        <RangePicker
                            value={dateRange}
                            onChange={handleDateRangeChange}
                            format="DD/MM/YYYY"
                            className="w-full h-11 rounded-xl"
                        />
                    </div>

                    {/* Specialty and Sort Options in 2 columns */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Specialty */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium text-gray-700">Chuyên khoa</Label>
                            <Select
                                value={filters.specialtyId}
                                onValueChange={value => handleChange('specialtyId', value)}
                            >
                                <SelectTrigger className="w-full h-11 rounded-xl">
                                    <SelectValue placeholder="Chọn chuyên khoa" />
                                </SelectTrigger>
                                <SelectContent>
                                    {specialties.map(specialty => (
                                        <SelectItem
                                            key={specialty.specialtyId}
                                            value={specialty.specialtyId}
                                        >
                                            {specialty.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Sort Options */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium text-gray-700">
                                Sắp xếp theo
                            </Label>
                            <Select
                                value={filters.sortBy}
                                onValueChange={value => handleChange('sortBy', value)}
                            >
                                <SelectTrigger className="w-full h-11 rounded-xl">
                                    <SelectValue placeholder="Chọn cách sắp xếp" />
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
                </div>

                <div className="flex justify-between pt-4 border-t">
                    <Button variant="outline" onClick={handleReset} className="rounded-xl">
                        Xóa bộ lọc
                    </Button>
                    <Button
                        onClick={handleApply}
                        className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl"
                    >
                        Áp dụng bộ lọc
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FilterAppointmentModal;
