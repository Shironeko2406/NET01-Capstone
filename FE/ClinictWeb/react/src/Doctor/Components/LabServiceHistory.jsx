import React, { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Activity, Calendar, CheckCircle, User } from 'lucide-react';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

const LabServiceHistory = () => {
    const { appointmentService } = useSelector(state => state.AppointmentReducer);

    return (
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
                                    {service.status === 'Completed' ? 'Đã có kết quả' : 'Đang chờ'}
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
    );
};

export default memo(LabServiceHistory);
