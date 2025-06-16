import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { TestTube, Save } from 'lucide-react';
import React, { memo } from 'react';
import { formatCurrency } from '../../Utils/Format/FormatCurrency';
import { useSelector } from 'react-redux';
import { Input } from 'antd';

const { TextArea } = Input;

const AddLabServiceModal = ({
    open,
    onOpenChange,
    selectedServicesInDialog,
    serviceNotesRef,
    handleServiceSelectionChange,
    handleNoteChange,
    handleNoteBlur,
    handleSaveSelectedServices,
}) => {
    const { services } = useSelector(state => state.ServiceReducer);
    const { appointmentService } = useSelector(state => state.AppointmentReducer);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="text-xl flex items-center gap-2">
                        <TestTube className="h-5 w-5" />
                        Chỉ định xét nghiệm
                    </DialogTitle>
                    <DialogDescription>
                        Chọn các dịch vụ xét nghiệm cần thiết cho bệnh nhân
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {services.map(service => {
                        const isSelected = selectedServicesInDialog.some(
                            s => s.serviceId === service.serviceId
                        );
                        const isOriginalService = appointmentService.some(
                            s => s.serviceId === service.serviceId
                        );

                        return (
                            <div
                                key={service.serviceId}
                                className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-4">
                                        <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={checked =>
                                                handleServiceSelectionChange(service, checked)
                                            }
                                            disabled={isOriginalService}
                                            className="data-[state=checked]:bg-purple-600"
                                        />
                                        <div>
                                            <p className="font-semibold text-slate-900">
                                                {service.name}
                                            </p>
                                            <p className="text-sm text-slate-600 mt-1">
                                                {service.description}
                                            </p>
                                            {isOriginalService && (
                                                <Badge variant="secondary" className="text-xs mt-1">
                                                    Đã thêm
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <span className="font-bold text-emerald-600 text-lg">
                                        {formatCurrency(service.price)}
                                    </span>
                                </div>

                                {isSelected && !isOriginalService && (
                                    <div className="mt-3 pl-8">
                                        <Label className="text-sm font-medium text-slate-700 mb-2 block">
                                            Ghi chú cho dịch vụ này:
                                        </Label>
                                        <TextArea
                                            placeholder="Nhập ghi chú cho dịch vụ xét nghiệm..."
                                            defaultValue={
                                                serviceNotesRef.current[service.serviceId] || ''
                                            }
                                            onChange={e =>
                                                handleNoteChange(service.serviceId, e.target.value)
                                            }
                                            onBlur={e =>
                                                handleNoteBlur(service.serviceId, e.target.value)
                                            }
                                            rows={2}
                                            className="resize-none text-sm"
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="px-6">
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSaveSelectedServices}
                        className="gap-2 bg-purple-600 hover:bg-purple-700"
                    >
                        <Save className="h-4 w-4" />
                        Lưu chỉ định xét nghiệm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default memo(AddLabServiceModal);
