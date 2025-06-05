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
import { getRoleTranslate } from '../../Utils/Translate&FormatColor/RoleUtil';
import { roles } from '../../Utils/Data/DataExport';

const FilterUserModal = ({ open, onOpenChange, onApplyFilter, currentFilters }) => {
    const [filters, setFilters] = useState({
        search: '',
        role: '', // Default role value
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
        const resetFilters = { search: '', role: '' };
        setFilters(resetFilters);
        onApplyFilter(resetFilters);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Bộ lọc người dùng
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Search Input */}
                    <div className="space-y-2">
                        <Label htmlFor="search">Tìm kiếm</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                id="search"
                                value={filters.search}
                                onChange={e => handleChange('search', e.target.value)}
                                placeholder="Tìm theo tên, email, username..."
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Role Filter */}
                    <div className="space-y-2">
                        <Label htmlFor="role">Vai trò</Label>
                        <Select
                            value={filters.role}
                            onValueChange={value => handleChange('role', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn vai trò" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map(role => (
                                    <SelectItem key={role.value} value={role.value}>
                                        {getRoleTranslate(role.value)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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

export default FilterUserModal;
