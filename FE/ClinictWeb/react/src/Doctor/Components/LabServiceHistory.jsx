'use client';

import { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Activity, Calendar, CheckCircle, FileX, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { formatDateTime } from '../../Utils/Format/FormatDate';

const LabServiceHistory = () => {
    const { appointmentService } = useSelector(state => state.AppointmentReducer);

    const servicesWithResults = appointmentService.filter(
        service =>
            service.testResult &&
            service.testResult.result !== null &&
            service.testResult.result !== undefined &&
            service.testResult.result.trim() !== ''
    );

    const hasNoResults = servicesWithResults.length === 0;

    return (
        <Card className="shadow-lg border-blue-100 bg-white p-0">
            <CardHeader className="py-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-t-lg flex items-center justify-between">
                <CardTitle className="flex items-center gap-3 text-base font-semibold text-gray-800">
                    <div className="p-2 bg-blue-100 rounded-lg shadow-sm">
                        <Activity className="h-5 w-5 text-blue-600" />
                    </div>
                    Lịch sử kết quả xét nghiệm
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-gray-50/30">
                {hasNoResults ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="p-4 bg-orange-100 rounded-full mb-4 shadow-sm">
                            <FileX className="h-8 w-8 text-orange-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Chưa có kết quả xét nghiệm
                        </h3>
                        <p className="text-sm text-gray-600 max-w-sm leading-relaxed">
                            Hiện tại chưa có thông tin kết quả xét nghiệm nào.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {servicesWithResults.map(service => (
                            <div
                                key={service.appointmentServiceId}
                                className="p-5 border border-blue-200 rounded-xl bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/30 shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900 text-base mb-2">
                                            {service.serviceName}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <User className="h-3 w-3 text-blue-500" />
                                                <span className="font-medium">Người XN:</span>
                                                <span className="text-blue-700 font-medium">
                                                    {service.testResult.createdBy}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3 text-green-500" />
                                                <span className="text-green-700 font-medium">
                                                    {formatDateTime(service.testResult.resultDate)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <Badge className="bg-green-100 text-green-800 border-green-200 shadow-sm px-3 py-1">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Đã có kết quả
                                    </Badge>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                    <Label className="text-xs text-indigo-600 font-semibold uppercase tracking-wide mb-2 block">
                                        Kết quả xét nghiệm:
                                    </Label>
                                    <p className="text-sm text-gray-800 leading-relaxed font-medium bg-gray-50 p-3 rounded-md border-l-4 border-blue-400">
                                        {service.testResult.result}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default memo(LabServiceHistory);
