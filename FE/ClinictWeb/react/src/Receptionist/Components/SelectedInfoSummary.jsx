import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CardTitle } from '@/components/ui/card';
import { formatAppointmentDate, formatDate } from '../../Utils/Format/FormatDate';

const SelectedInfoSummary = ({
    currentStep,
    patientInfo,
    selectedSpecialty,
    selectedDate,
    selectedTimeSlot,
    selectedDoctor,
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-3">
            <div className="border-b border-gray-200 px-1 py-4 mb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Thông tin đã nhập</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                        Tóm tắt
                    </Badge>
                </div>
            </div>
            <div className="space-y-1 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-600">Bệnh nhân:</span>
                    <span className="font-semibold break-words text-right">
                        {patientInfo.fullName}
                    </span>
                </div>
                {selectedSpecialty && (
                    <div className="flex justify-between py-1 border-b border-gray-100">
                        <span className="text-gray-600">Chuyên khoa:</span>
                        <span className="font-semibold break-words text-right">
                            {selectedSpecialty.name}
                        </span>
                    </div>
                )}
                {selectedDate && currentStep > 3 && (
                    <div className="flex justify-between py-1 border-b border-gray-100">
                        <span className="text-gray-600">Ngày khám:</span>
                        <span className="font-semibold">{formatAppointmentDate(selectedDate)}</span>
                    </div>
                )}
                {selectedTimeSlot && currentStep > 4 && (
                    <div className="flex justify-between py-1 border-b border-gray-100">
                        <span className="text-gray-600">Giờ khám:</span>
                        <span className="font-semibold">{selectedTimeSlot.time}</span>
                    </div>
                )}
                {selectedDoctor && currentStep >= 5 && (
                    <div className="flex justify-between py-1">
                        <span className="text-gray-600">Bác sĩ:</span>
                        <span className="font-semibold break-words text-right">
                            BS. {selectedDoctor.fullName}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SelectedInfoSummary;
