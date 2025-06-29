import { memo } from 'react';
import { Input } from 'antd';
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
import { Plus, TestTube, Trash2, Edit, Send, MoreVertical, Check, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { formatCurrency } from '../../Utils/Format/FormatCurrency';
import { formatDateTime } from '../../Utils/Format/FormatDate';
import {
    getAppointmentServiceStatusColor,
    getAppointmentServiceStatusLabel,
} from '../../Utils/Translate&FormatColor/AppointmentServiceUtil';

const { TextArea } = Input;

const LabServiceList = ({
    handleOpenLabServiceDialog,
    handleRemoveLabService,
    handleSendRequestLabService,
    editingServiceId,
    handleEditNote,
    handleSaveNote,
    handleCancelEdit,
    handleNoteInputChange,
}) => {
    const { appointmentInfo, appointmentService } = useSelector(state => state.AppointmentReducer);

    return (
        <Card className="shadow-lg border-teal-100 bg-white p-0">
            <CardHeader className="py-4 bg-gradient-to-r from-teal-50 via-cyan-50 to-blue-50 rounded-t-lg flex items-center justify-between">
                <CardTitle className="flex items-center gap-3 text-base font-semibold text-gray-800">
                    <div className="p-2 bg-teal-100 rounded-lg shadow-sm">
                        <TestTube className="h-5 w-5 text-teal-600" />
                    </div>
                    Dịch vụ đã chỉ định
                </CardTitle>
                {appointmentInfo.status === 'InProgress' && (
                    <Button
                        onClick={handleOpenLabServiceDialog}
                        className="gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-md transition-all duration-200 hover:shadow-lg"
                    >
                        <Plus className="h-4 w-4" />
                        Thêm xét nghiệm
                    </Button>
                )}
            </CardHeader>
            <CardContent className="p-6 bg-gray-50/30">
                {appointmentService.length > 0 ? (
                    <div className="space-y-4">
                        {appointmentService.map(service => (
                            <div
                                key={service.appointmentServiceId}
                                className="p-5 rounded-xl bg-gradient-to-r from-white via-teal-50/20 to-cyan-50/20 border border-teal-200 hover:shadow-md hover:border-teal-300 transition-all duration-200"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <h3 className="font-semibold text-gray-900 text-base flex-1">
                                            {service.serviceName}
                                        </h3>
                                        {service.status === 'Assigned' && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full flex-shrink-0"
                                                    >
                                                        <MoreVertical className="h-4 w-4 text-gray-500" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleRemoveLabService(
                                                                service.appointmentServiceId
                                                            )
                                                        }
                                                        className="text-red-600 focus:text-red-700 focus:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Xóa
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleEditNote(service)}
                                                        className="focus:bg-blue-50"
                                                    >
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Sửa
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleSendRequestLabService(
                                                                service.appointmentServiceId
                                                            )
                                                        }
                                                        className="focus:bg-green-50"
                                                    >
                                                        <Send className="h-4 w-4 mr-2" />
                                                        Yêu cầu xét nghiệm
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </div>

                                    {editingServiceId === service.appointmentServiceId ? (
                                        <div className="mb-3 space-y-2">
                                            <TextArea
                                                defaultValue={service.note || ''}
                                                onChange={handleNoteInputChange}
                                                placeholder="Nhập ghi chú..."
                                                rows={3}
                                                className="!mb-2"
                                            />
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        handleSaveNote(service.appointmentServiceId)
                                                    }
                                                    className="gap-1 bg-green-600 hover:bg-green-700"
                                                >
                                                    <Check className="h-3 w-3" />
                                                    Lưu
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={handleCancelEdit}
                                                    className="gap-1"
                                                >
                                                    <X className="h-3 w-3" />
                                                    Hủy
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        service.note && (
                                            <p className="text-sm text-gray-600 mb-3 bg-gray-50 p-2 rounded-md border-l-3 border-teal-400">
                                                {service.note}
                                            </p>
                                        )
                                    )}

                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-lg font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                                            {formatCurrency(service.price)}₫
                                        </p>
                                        <Badge
                                            className={getAppointmentServiceStatusColor(
                                                service.status
                                            )}
                                        >
                                            {getAppointmentServiceStatusLabel(service.status)}
                                        </Badge>
                                    </div>

                                    {service.testResult && service.testResult.result && (
                                        <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                                            <Label className="text-xs text-indigo-600 font-semibold uppercase tracking-wide mb-2 block">
                                                Kết quả xét nghiệm:
                                            </Label>
                                            <p className="text-sm text-gray-800 leading-relaxed mb-3 bg-gray-50 p-3 rounded-md border-l-4 border-green-400">
                                                {service.testResult.result}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <span className="font-medium">Ngày:</span>
                                                    <span className="text-blue-700 font-medium">
                                                        {formatDateTime(
                                                            service.testResult.resultDate
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="font-medium">
                                                        Người thực hiện:
                                                    </span>
                                                    <span className="text-green-700 font-medium">
                                                        {service.testResult.createdBy}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="p-4 bg-teal-100 rounded-full w-fit mx-auto mb-4 shadow-sm">
                            <TestTube className="h-8 w-8 text-teal-500" />
                        </div>
                        <h3 className="text-gray-800 text-lg font-semibold mb-2">
                            Chưa chỉ định xét nghiệm nào
                        </h3>
                        <p className="text-gray-600 text-sm">Nhấn "Thêm xét nghiệm" để bắt đầu</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default memo(LabServiceList);
