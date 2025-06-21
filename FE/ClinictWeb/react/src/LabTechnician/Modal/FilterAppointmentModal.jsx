import { useState, useEffect } from 'react';
import { Search, Calendar } from 'lucide-react';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const FilterAppointmentModal = ({ open, onOpenChange, onApplyFilter, currentFilters }) => {
    const [filters, setFilters] = useState({
        search: '',
        appointmentDate: '',
    });

    const [selectedDate, setSelectedDate] = useState(
        currentFilters.appointmentDate ? dayjs(currentFilters.appointmentDate) : null
    );

    useEffect(() => {
        if (open) {
            setFilters({
                search: currentFilters.search || '',
                appointmentDate: currentFilters.appointmentDate || '',
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
        if (date) {
            setFilters(prev => ({
                ...prev,
                appointmentDate: date.format('YYYY-MM-DD'),
            }));
        } else {
            setFilters(prev => ({
                ...prev,
                appointmentDate: '',
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
        };
        setFilters(resetFilters);
        setSelectedDate(null);
        onApplyFilter(resetFilters);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[90vw] sm:max-w-lg md:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Bộ lọc lịch hẹn xét nghiệm
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                <Label htmlFor="appointmentDate">Ngày hẹn</Label>
                                <DatePicker
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    format="DD/MM/YYYY"
                                    style={{ width: '100%', height: '40px' }}
                                    allowClear
                                    placeholder="Chọn ngày hẹn"
                                    suffixIcon={<Calendar className="h-4 w-4 text-gray-500" />}
                                />
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
