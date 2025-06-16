import { useState, useEffect } from 'react';
import { Search, Filter, Calendar } from 'lucide-react';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import { useSelector } from 'react-redux';
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
import { sortOptions } from '../../Utils/Data/DataExport';

const { RangePicker } = DatePicker;

const FilterAppointmentModal = ({ open, onOpenChange, onApplyFilter, currentFilters }) => {
    const { specialties } = useSelector(state => state.SpecialtyReducer);
    const [filters, setFilters] = useState({
        search: '',
        specialtyId: '',
        sortBy: '',
        startDate: '',
        endDate: '',
    });

    const [selectedRange, setSelectedRange] = useState(
        currentFilters.startDate && currentFilters.endDate
            ? [dayjs(currentFilters.startDate), dayjs(currentFilters.endDate)]
            : []
    );

    useEffect(() => {
        if (open) {
            setFilters({
                search: currentFilters.search || '',
                specialtyId: currentFilters.specialtyId || '',
                sortBy: currentFilters.sortBy || '',
                startDate: currentFilters.startDate || '',
                endDate: currentFilters.endDate || '',
            });

            setSelectedRange(
                currentFilters.startDate && currentFilters.endDate
                    ? [dayjs(currentFilters.startDate), dayjs(currentFilters.endDate)]
                    : []
            );
        }
    }, [open, currentFilters]);

    const handleChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleRangeChange = dates => {
        setSelectedRange(dates);
        if (dates && dates.length === 2) {
            setFilters(prev => ({
                ...prev,
                startDate: dates[0].format('YYYY-MM-DD'),
                endDate: dates[1].format('YYYY-MM-DD'),
            }));
        } else {
            setFilters(prev => ({
                ...prev,
                startDate: '',
                endDate: '',
            }));
        }
    };

    const handleApply = () => {
        onApplyFilter(filters);
        onOpenChange(false);
    };

    const handleReset = () => {
        const resetFilters = {
            search: '',
            specialtyId: '',
            sortBy: '',
            startDate: '',
            endDate: '',
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
                        Bộ lọc lịch hẹn
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
                                        placeholder="Tìm theo tên, mã lịch hẹn..."
                                        className="pl-10 w-full"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="specialtyId">Chuyên khoa</Label>
                                <Select
                                    value={filters.specialtyId}
                                    onValueChange={value => handleChange('specialtyId', value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Chọn chuyên khoa" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {specialties &&
                                            specialties.map(specialty => (
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

                        <div className="space-y-2">
                            <Label htmlFor="dateRange">Khoảng thời gian</Label>
                            <RangePicker
                                value={selectedRange}
                                onChange={handleRangeChange}
                                format="DD/MM/YYYY"
                                style={{ width: '100%', height: '40px' }}
                                allowClear
                                placeholder={['Từ ngày', 'Đến ngày']}
                                suffixIcon={<Calendar className="h-4 w-4 text-gray-500" />}
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

export default FilterAppointmentModal;
