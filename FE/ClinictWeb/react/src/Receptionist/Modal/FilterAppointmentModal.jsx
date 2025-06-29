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
import { timeSlots } from '../../Utils/Data/BookingData';
import { getSelectedTimeSlotId } from '../../Utils/GetTimeSlot';

const FilterAppointmentModal = ({ open, onOpenChange, onApplyFilter, currentFilters }) => {
    const { specialties } = useSelector(state => state.SpecialtyReducer);
    const [filters, setFilters] = useState({
        search: '',
        appointmentDate: '',
        specialtyId: '',
        sortBy: '',
        startTime: '',
        endTime: '',
    });

    const [selectedDate, setSelectedDate] = useState(
        currentFilters.appointmentDate ? dayjs(currentFilters.appointmentDate) : null
    );

    useEffect(() => {
        if (open) {
            setFilters({
                search: currentFilters.search || '',
                appointmentDate: currentFilters.appointmentDate || '',
                specialtyId: currentFilters.specialtyId || '',
                sortBy: currentFilters.sortBy || '',
                startTime: currentFilters.startTime || '',
                endTime: currentFilters.endTime || '',
            });
            setSelectedDate(
                currentFilters.appointmentDate ? dayjs(currentFilters.appointmentDate) : null
            );
        }
    }, [open, currentFilters]);

    const handleChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = date => {
        setSelectedDate(date);
        setFilters(prev => ({
            ...prev,
            appointmentDate: date.format('YYYY-MM-DD'),
        }));
    };

    const handleTimeSlotChange = timeSlotId => {
        const selectedTimeSlot = timeSlots.find(slot => slot.id === timeSlotId);
        if (selectedTimeSlot) {
            setFilters(prev => ({
                ...prev,
                startTime: selectedTimeSlot.startTime,
                endTime: selectedTimeSlot.endTime,
            }));
        } else {
            setFilters(prev => ({
                ...prev,
                startTime: '',
                endTime: '',
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
            appointmentDate: '',
            specialtyId: '',
            sortBy: '',
            startTime: '',
            endTime: '',
        };
        setFilters(resetFilters);
        setSelectedDate(null);
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

                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="appointmentDate">Ngày hẹn</Label>
                                <DatePicker
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    format="DD/MM/YYYY"
                                    placeholder="Chọn ngày hẹn"
                                    style={{ width: '100%', height: '40px' }}
                                    allowClear
                                    suffixIcon={<Calendar className="h-4 w-4 text-gray-500" />}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="timeSlot">Khung giờ</Label>
                                <Select
                                    value={getSelectedTimeSlotId(
                                        filters.startTime,
                                        filters.endTime
                                    )}
                                    onValueChange={handleTimeSlotChange}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Chọn khung giờ" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {timeSlots.map(slot => (
                                            <SelectItem key={slot.id} value={slot.id}>
                                                {slot.time}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
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
