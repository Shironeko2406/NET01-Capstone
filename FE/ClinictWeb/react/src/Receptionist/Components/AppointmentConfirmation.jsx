import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText } from 'lucide-react';
import { calculateAge, formatAppointmentDate } from '../../Utils/Format/FormatDate';
import { getGenderTranslate } from '../../Utils/Translate&FormatColor/GenderUlti';

const AppointmentConfirmation = ({
    patientInfo,
    selectedSpecialty,
    selectedDate,
    selectedTimeSlot,
    selectedDoctor,
    appointmentNote,
    setAppointmentNote,
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-3">
            <div className="border-b border-gray-200 px-1 py-4 mb-6">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Xác nhận thông tin đặt lịch</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                        Bước 6/6
                    </Badge>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <Label htmlFor="note" className="text-sm font-medium">
                        Ghi chú cho cuộc hẹn <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                        id="note"
                        value={appointmentNote}
                        onChange={e => setAppointmentNote(e.target.value)}
                        placeholder="Mô tả triệu chứng hoặc lý do khám bệnh..."
                        rows={3}
                        className="mt-1 text-sm border-gray-300"
                    />
                </div>

                <Card className="border border-gray-200">
                    <CardHeader className="py-3">
                        <CardTitle className="text-base text-gray-900 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Tóm tắt thông tin đặt lịch
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="pb-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Thông tin bệnh nhân */}
                            <div className="space-y-2">
                                <h4 className="font-semibold text-gray-800 border-b pb-1 text-sm">
                                    Thông tin bệnh nhân
                                </h4>
                                <div className="space-y-1 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Họ tên:</span>
                                        <span className="font-medium break-words text-right">
                                            {patientInfo.fullName}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Điện thoại:</span>
                                        <span className="font-medium">
                                            {patientInfo.phoneNumber}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Email:</span>
                                        <span className="font-medium break-words text-right">
                                            {patientInfo.email || 'Chưa có'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tuổi:</span>
                                        <span className="font-medium">
                                            {calculateAge(patientInfo.dateOfBirth)} tuổi
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Giới tính:</span>
                                        <span className="font-medium">
                                            {getGenderTranslate(patientInfo.gender)}
                                        </span>
                                    </div>
                                    {patientInfo.address && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Địa chỉ:</span>
                                            <span className="font-medium break-words text-right">
                                                {patientInfo.address}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Thông tin lịch khám */}
                            <div className="space-y-2">
                                <h4 className="font-semibold text-gray-800 border-b pb-1 text-sm">
                                    Thông tin lịch khám
                                </h4>
                                <div className="space-y-1 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Chuyên khoa:</span>
                                        <span className="font-medium break-words text-right">
                                            {selectedSpecialty.name}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Ngày khám:</span>
                                        <span className="font-medium">
                                            {formatAppointmentDate(selectedDate)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Giờ khám:</span>
                                        <span className="font-medium">{selectedTimeSlot.time}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Bác sĩ:</span>
                                        <span className="font-medium break-words text-right">
                                            BS. {selectedDoctor.fullName}
                                        </span>
                                    </div>
                                    <div className="flex justify-between pt-1 border-t">
                                        <span className="text-gray-600 font-medium">
                                            Chi phí khám:
                                        </span>
                                        <span className="font-bold text-green-600 text-sm">
                                            350,000 VNĐ
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {appointmentNote && (
                            <div className="mt-3 pt-2 border-t">
                                <h4 className="font-semibold text-gray-800 mb-1 text-sm">
                                    Ghi chú:
                                </h4>
                                <p className="text-xs text-gray-700 bg-gray-50 p-2 rounded-lg border break-words">
                                    {appointmentNote}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default memo(AppointmentConfirmation);
