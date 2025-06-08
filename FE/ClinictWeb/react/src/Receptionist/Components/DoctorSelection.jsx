import React, { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { Stethoscope, Phone, Mail, Award, Clock, DollarSign, Check } from 'lucide-react';
import { formatDate } from '../../Utils/Format/FormatDate';
import { useSelector } from 'react-redux';

const DoctorSelection = ({
    patientInfo,
    selectedSpecialty,
    selectedDate,
    selectedTimeSlot,
    selectedDoctor,
    setSelectedDoctor,
}) => {
    const { doctors } = useSelector(state => state.UsersReducer);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-3">
            <div className="border-b border-gray-200 px-1 py-4 mb-6">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Chọn bác sĩ</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                        Bước 5/6
                    </Badge>
                </div>
            </div>

            <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-emerald-500 flex-shrink-0"></div>
                                <h3 className="font-medium text-sm text-gray-700">
                                    Thông tin bệnh nhân
                                </h3>
                            </div>
                            <div className="pl-6 space-y-1">
                                <p className="text-xs text-gray-600 flex justify-between">
                                    <span>Họ tên:</span>
                                    <span className="font-medium">{patientInfo.fullName}</span>
                                </p>
                                <p className="text-xs text-gray-600 flex justify-between">
                                    <span>Giới tính:</span>
                                    <span className="font-medium">{patientInfo.gender}</span>
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-blue-500 flex-shrink-0"></div>
                                <h3 className="font-medium text-sm text-gray-700">
                                    Thông tin lịch khám
                                </h3>
                            </div>
                            <div className="pl-6 space-y-1">
                                <p className="text-xs text-gray-600 flex justify-between">
                                    <span>Chuyên khoa:</span>
                                    <span className="font-medium">{selectedSpecialty.name}</span>
                                </p>
                                <p className="text-xs text-gray-600 flex justify-between">
                                    <span>Ngày & giờ:</span>
                                    <span className="font-medium">
                                        {formatDate(selectedDate)} | {selectedTimeSlot.time}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-800">Danh sách bác sĩ</h3>
                    <Badge
                        variant="outline"
                        className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200"
                    >
                        {doctors.length} bác sĩ khả dụng
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {doctors.map(doctor => (
                    <Card
                        key={doctor.userId}
                        className={`cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-md border py-0 ${
                            selectedDoctor?.userId === doctor.userId
                                ? 'ring-2 ring-emerald-600 bg-emerald-50 border-emerald-300'
                                : 'hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedDoctor(doctor)}
                    >
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/4 bg-gradient-to-br from-gray-100 to-gray-200 p-4 flex flex-col items-center justify-center">
                                <div className="h-24 w-24 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-full flex items-center justify-center shadow-md mb-3">
                                    <Stethoscope className="h-12 w-12 text-white" />
                                </div>
                                <h3 className="text-base font-bold text-gray-900 text-center mb-1">
                                    BS. {doctor.fullName}
                                </h3>
                                <div className="flex flex-wrap justify-center gap-1 mb-2">
                                    {doctor.specialties.map((specialty, index) => (
                                        <Badge
                                            key={index}
                                            variant="secondary"
                                            className="text-xs py-0 px-2 bg-white text-gray-700"
                                        >
                                            {specialty}
                                        </Badge>
                                    ))}
                                </div>
                                {selectedDoctor?.userId === doctor.userId ? (
                                    <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-1 px-3">
                                        <Check className="h-3 w-3 mr-1" />
                                        Đã chọn
                                    </Badge>
                                ) : (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                                    >
                                        Chọn bác sĩ
                                    </Button>
                                )}
                            </div>

                            <div className="flex-1 p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                                                Thông tin liên hệ
                                            </h4>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm text-gray-600">
                                                        {doctor.phoneNumber}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm text-gray-600">
                                                        {doctor.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                                                Kinh nghiệm
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                <Award className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm text-gray-600">
                                                    15 năm kinh nghiệm
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                                                Thời gian khám
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm text-gray-600">
                                                    {selectedTimeSlot.time} -{' '}
                                                    {formatDate(selectedDate)}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                                                Chi phí khám
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="h-4 w-4 text-gray-400" />
                                                <span className="text-base font-bold text-emerald-600">
                                                    350,000 VNĐ
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                                        Thông tin thêm
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        Bác sĩ {doctor.fullName} có {doctor.experience} trong lĩnh
                                        vực {doctor.specialties.join(', ')}. Với kinh nghiệm phong
                                        phú và kỹ năng chuyên môn cao, bác sĩ đã giúp đỡ nhiều bệnh
                                        nhân đạt được kết quả điều trị tốt nhất.
                                    </p>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-xs text-green-600 font-medium">
                                            Sẵn sàng khám bệnh
                                        </span>
                                    </div>

                                    {selectedDoctor?.userId === doctor.userId ? (
                                        <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-1 px-3">
                                            <Check className="h-3 w-3 mr-1" />
                                            Đã chọn
                                        </Badge>
                                    ) : (
                                        <Button
                                            size="sm"
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                                        >
                                            Chọn bác sĩ này
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default memo(DoctorSelection);
