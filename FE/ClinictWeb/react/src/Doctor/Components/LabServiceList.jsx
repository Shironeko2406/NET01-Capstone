import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Plus, TestTube, Trash2, Edit, Send, MoreVertical } from 'lucide-react';
import dayjs from 'dayjs';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { formatCurrency } from '../../Utils/Format/FormatCurrency';

const LabServiceList = ({ handleOpenLabServiceDialog, handleRemoveLabService }) => {
    const { appointmentService } = useSelector(state => state.AppointmentReducer);
    return (
        <Card className="shadow-sm border-slate-200">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <TestTube className="h-5 w-5 text-purple-600" />
                        </div>
                        Dịch vụ đã chỉ định
                    </CardTitle>
                    <Button
                        onClick={handleOpenLabServiceDialog}
                        className="gap-2 bg-purple-600 hover:bg-purple-700"
                    >
                        <Plus className="h-4 w-4" />
                        Thêm xét nghiệm
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                {appointmentService.length > 0 ? (
                    <div className="space-y-4">
                        {appointmentService.map(service => (
                            <div
                                key={service.appointmentServiceId}
                                className="flex items-start justify-between p-4 rounded-lg hover:bg-slate-50 transition-colors relative"
                            >
                                <div className="flex-1">
                                    <div className="flex items-start justify-between w-full">
                                        <p className="font-semibold text-slate-900">
                                            {service.serviceName}
                                        </p>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <MoreVertical className="h-4 w-4" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleRemoveLabService(service.serviceId)
                                                    }
                                                    className="text-red-600 focus:text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" /> Xóa
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Edit className="h-4 w-4 mr-2" /> Sửa
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Send className="h-4 w-4 mr-2" /> Gửi yêu cầu
                                                    xét nghiệm
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <p className="text-sm text-slate-600 mt-1">{service.note}</p>
                                    <p className="text-lg font-bold text-emerald-600 mt-2">
                                        {formatCurrency(service.price)}
                                    </p>
                                    {service.status && (
                                        <Badge
                                            className={`mt-2 ${
                                                service.status === 'Completed'
                                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                                    : 'bg-orange-100 text-orange-800 border-orange-200'
                                            }`}
                                        >
                                            {service.status === 'Completed'
                                                ? 'Đã hoàn thành'
                                                : 'Đang chờ'}
                                        </Badge>
                                    )}
                                    {service.testResult && (
                                        <div className="mt-3 p-3 bg-gray-50 rounded">
                                            <Label className="text-xs text-slate-600 font-medium">
                                                Kết quả:
                                            </Label>
                                            <p className="text-sm text-slate-800 mt-1 leading-relaxed">
                                                {service.testResult.result}
                                            </p>
                                            <p className="text-xs text-slate-600 mt-1">
                                                Ngày:{' '}
                                                {dayjs(service.testResult.resultDate).format(
                                                    'DD/MM/YYYY HH:mm'
                                                )}{' '}
                                                - Người thực hiện: {service.testResult.createdBy}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="p-4 bg-slate-100 rounded-full w-fit mx-auto mb-4">
                            <TestTube className="h-8 w-8 text-slate-400" />
                        </div>
                        <p className="text-slate-500 text-lg">Chưa chỉ định xét nghiệm nào</p>
                        <p className="text-slate-400 text-sm mt-1">
                            Nhấn "Thêm xét nghiệm" để bắt đầu
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
export default memo(LabServiceList);
