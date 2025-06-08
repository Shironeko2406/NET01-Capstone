import React, { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { CardTitle } from '@/components/ui/card';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

const AppointmentDateSelection = ({
    patientInfo,
    selectedSpecialty,
    selectedDate,
    setSelectedDate,
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-3">
            <div className="border-b border-gray-200 px-1 py-4 mb-6">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Chọn ngày khám</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                        Bước 3/6
                    </Badge>
                </div>
            </div>

            <div className="flex flex-col items-center">
                <div className="mb-4 text-center w-full">
                    <p className="text-xs md:text-sm text-gray-600 mb-1 break-words">
                        Bệnh nhân: <span className="font-semibold">{patientInfo.fullName}</span>
                    </p>
                    <p className="text-xs md:text-sm text-gray-600 break-words">
                        Chuyên khoa: <span className="font-semibold">{selectedSpecialty.name}</span>
                    </p>
                </div>

                <div className="w-full max-w-sm">
                    <DatePicker
                        value={selectedDate}
                        onChange={setSelectedDate}
                        className="w-full h-10 border-gray-300"
                        disabledDate={current => current && current < dayjs().startOf('day')}
                    />
                </div>
            </div>
        </div>
    );
};

export default memo(AppointmentDateSelection);
