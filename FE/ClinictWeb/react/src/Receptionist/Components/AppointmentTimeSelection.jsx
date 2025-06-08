import React, { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Clock, Check } from 'lucide-react';
import { formatDate } from '../../Utils/Format/FormatDate';
import { timeSlots } from '../../Utils/Data/BookingData';

const AppointmentTimeSelection = ({
    patientInfo,
    selectedSpecialty,
    selectedDate,
    selectedTimeSlot,
    setSelectedTimeSlot,
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-3">
            <div className="border-b border-gray-200 px-1 py-4 mb-6">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Chọn giờ khám</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                        Bước 4/6
                    </Badge>
                </div>
            </div>

            <div className="mb-4 text-center">
                <div className="space-y-1">
                    <p className="text-xs md:text-sm text-gray-600 break-words">
                        Bệnh nhân: <span className="font-semibold">{patientInfo.fullName}</span>
                    </p>
                    <p className="text-xs md:text-sm text-gray-600 break-words">
                        Chuyên khoa: <span className="font-semibold">{selectedSpecialty.name}</span>
                    </p>
                    <p className="text-xs md:text-sm text-gray-600">
                        Ngày khám: <span className="font-semibold">{formatDate(selectedDate)}</span>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
                {timeSlots.map(slot => (
                    <Card
                        key={slot.id}
                        className={`cursor-pointer transition-all ${
                            selectedTimeSlot?.id === slot.id
                                ? 'ring-2 ring-emerald-600 bg-emerald-50'
                                : 'hover:bg-gray-50 hover:shadow-md'
                        }`}
                        onClick={() => setSelectedTimeSlot(slot)}
                    >
                        <CardContent className="p-3 text-center">
                            <Clock className="h-5 w-5 mx-auto mb-2 text-gray-600" />
                            <h3 className="font-semibold text-sm mb-2">{slot.time}</h3>
                            {selectedTimeSlot?.id === slot.id ? (
                                <Badge className="bg-emerald-600 text-xs py-0">
                                    <Check className="h-3 w-3 mr-1" />
                                    Đã chọn
                                </Badge>
                            ) : (
                                <Badge
                                    variant="outline"
                                    className="text-green-600 border-green-600 text-xs py-0"
                                >
                                    Còn trống
                                </Badge>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default memo(AppointmentTimeSelection);
