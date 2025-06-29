import React, { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Heart, User, Phone, AlertTriangle } from 'lucide-react';
import { calculateAge, formatAppointmentDate } from '../../Utils/Format/FormatDate';
import { useSelector } from 'react-redux';
import {
    getAppointmentStatusColor,
    getAppointmentStatusTranslate,
} from '../../Utils/Translate&FormatColor/StatusAppointmentUtil';

const AppointmentInfoDetailCard = () => {
    const { appointmentInfo } = useSelector(state => state.AppointmentReducer);

    return (
        <Card className="border-0 border-l-4 border-l-blue-500 bg-white shadow-sm p-0">
            <CardContent className="px-6 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Patient Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">
                                Thông tin bệnh nhân
                            </h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="text-slate-600 min-w-[60px]">Họ tên:</span>
                                <span className="font-semibold text-slate-900">
                                    {appointmentInfo?.patientName}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-slate-600 min-w-[60px]">Tuổi:</span>
                                <span className="font-medium text-slate-800">
                                    {calculateAge(appointmentInfo?.patientDob)} tuổi
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-slate-600 min-w-[60px]">Giới tính:</span>
                                <span className="font-medium text-slate-800">
                                    {appointmentInfo?.patientGender === 'Female' ? 'Nữ' : 'Nam'}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-slate-500" />
                                <span className="font-medium text-slate-800">
                                    {appointmentInfo?.patientPhone}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Appointment Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                                <Calendar className="h-5 w-5 text-emerald-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">Lịch khám</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-slate-500" />
                                <span className="font-medium text-slate-800">
                                    {formatAppointmentDate(appointmentInfo?.appointmentDate)}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="h-4 w-4 text-slate-500" />
                                <span className="font-medium text-slate-800">
                                    {appointmentInfo?.startTime.slice(0, 5)} -{' '}
                                    {appointmentInfo?.endTime.slice(0, 5)}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="h-4 w-4 text-slate-500" />
                                <span className="font-medium text-slate-800">
                                    Phòng khám {appointmentInfo?.specialtyName}
                                </span>
                            </div>
                            <Badge
                                className={getAppointmentStatusColor(appointmentInfo?.status)}
                                variant="secondary"
                            >
                                {getAppointmentStatusTranslate(appointmentInfo?.status)}
                            </Badge>
                        </div>
                    </div>

                    {/* Medical History */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <Heart className="h-5 w-5 text-amber-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">Lý do khám</h3>
                        </div>
                        <p className="text-slate-700 bg-slate-50 p-3 rounded-lg">
                            {appointmentInfo?.note}
                        </p>
                        <div>
                            <h4 className="text-sm font-medium text-slate-600 mb-2 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                Bác sĩ phụ trách:
                            </h4>
                            <Badge
                                variant="outline"
                                className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                            >
                                {appointmentInfo?.doctorName} - {appointmentInfo?.specialtyName}
                            </Badge>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default memo(AppointmentInfoDetailCard);
