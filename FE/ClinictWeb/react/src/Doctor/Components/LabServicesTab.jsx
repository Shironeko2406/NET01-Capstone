import React from 'react';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Activity, Calendar, CheckCircle, Edit, Plus, TestTube, Trash2, User } from 'lucide-react';

const LabServicesTab = ({
    appointmentService,
    isLabServicesSaved,
    setIsLabServicesSaved,
    setIsLabServiceDialogOpen,
    handleRemoveLabService,
    handleSaveLabServices,
    formatCurrency,
}) => {
    return (
        <TabsContent value="lab-services">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chỉ định xét nghiệm */}
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <TestTube className="h-5 w-5 text-purple-600" />
                                </div>
                                Dịch vụ đã chỉ định
                            </CardTitle>
                            {appointmentService.length === 0 ? (
                                <Button
                                    onClick={() => setIsLabServiceDialogOpen(true)}
                                    className="gap-2 bg-purple-600 hover:bg-purple-700"
                                >
                                    <Plus className="h-4 w-4" />
                                    Thêm xét nghiệm
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => setIsLabServicesSaved(false)}
                                    variant="outline"
                                    className="gap-2"
                                >
                                    <Edit className="h-4 w-4" />
                                    Chỉnh sửa
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        {appointmentService.length > 0 ? (
                            <div className="space-y-4">
                                {appointmentService.map(service => (
                                    <div
                                        key={service.appointmentServiceId}
                                        className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-900">
                                                {service.serviceName}
                                            </p>
                                            <p className="text-sm text-slate-600 mt-1">
                                                {service.serviceDescription}
                                            </p>
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
                                                        {dayjs(
                                                            service.testResult.resultDate
                                                        ).format('DD/MM/YYYY HH:mm')}{' '}
                                                        - Người thực hiện:{' '}
                                                        {service.testResult.createdBy}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        {!isLabServicesSaved && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleRemoveLabService(service.serviceId)
                                                }
                                                className="text-red-600 hover:bg-red-50 hover:border-red-200"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                {!isLabServicesSaved && (
                                    <Button
                                        onClick={handleSaveLabServices}
                                        className="gap-2 mt-4 w-full bg-purple-600 hover:bg-purple-700"
                                        disabled={appointmentService.length === 0}
                                    >
                                        <Save className="h-4 w-4" />
                                        Lưu chỉ định xét nghiệm
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="p-4 bg-slate-100 rounded-full w-fit mx-auto mb-4">
                                    <TestTube className="h-8 w-8 text-slate-400" />
                                </div>
                                <p className="text-slate-500 text-lg">
                                    Chưa chỉ định xét nghiệm nào
                                </p>
                                <p className="text-slate-400 text-sm mt-1">
                                    Nhấn \"Thêm xét nghiệm\" để bắt đầu
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Lịch sử kết quả xét nghiệm */}
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-t-lg">
                        <CardTitle className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 rounded-lg">
                                <Activity className="h-5 w-5 text-slate-600" />
                            </div>
                            Lịch sử kết quả xét nghiệm
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {appointmentService.map(service => (
                                <div
                                    key={service.appointmentServiceId}
                                    className="p-4 border border-slate-200 rounded-lg bg-gradient-to-r from-slate-50 to-gray-50"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-900">
                                                {service.serviceName}
                                            </p>
                                            <p className="text-xs text-slate-600 mt-1 flex items-center gap-2">
                                                <User className="h-3 w-3" />
                                                Người XN:{' '}
                                                {service.testResult?.createdBy || 'Chưa thực hiện'}
                                                <Calendar className="h-3 w-3 ml-2" />
                                                {service.testResult
                                                    ? dayjs(service.testResult.resultDate).format(
                                                          'DD/MM/YYYY'
                                                      )
                                                    : 'Chưa có'}
                                            </p>
                                        </div>
                                        <Badge
                                            className={`${
                                                service.status === 'Completed'
                                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                                    : 'bg-orange-100 text-orange-800 border-orange-200'
                                            }`}
                                        >
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            {service.status === 'Completed'
                                                ? 'Đã có kết quả'
                                                : 'Đang chờ'}
                                        </Badge>
                                    </div>
                                    {service.testResult && (
                                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                                            <Label className="text-xs text-slate-600 font-medium">
                                                Kết quả:
                                            </Label>
                                            <p className="text-sm text-slate-800 mt-1 leading-relaxed">
                                                {service.testResult.result}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
    );
};

export default LabServicesTab;
