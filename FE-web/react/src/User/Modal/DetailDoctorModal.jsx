import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, Stethoscope } from 'lucide-react';
import { formatDate } from '../../Utils/Format/FormatDate';

const DetailDoctorModal = ({ doctor, selectedDate, selectedTimeSlot, open, onOpenChange }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Thông tin bác sĩ</DialogTitle>
                    <DialogDescription>
                        Chi tiết về BS. {doctor?.fullName || 'Không xác định'}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        {doctor?.avatar ? (
                            <img
                                src={doctor.avatar || '/placeholder.svg'}
                                alt={doctor.fullName || 'Bác sĩ'}
                                className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-md"
                            />
                        ) : (
                            <div className="h-24 w-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                                <Stethoscope className="h-12 w-12 text-white" />
                            </div>
                        )}
                        <div>
                            <h3 className="text-xl font-bold">
                                BS. {doctor?.fullName || 'Không xác định'}
                            </h3>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {doctor?.specialties?.length > 0 ? (
                                    doctor.specialties.map((specialty, index) => (
                                        <Badge
                                            key={index}
                                            variant="secondary"
                                            className="bg-blue-100 text-blue-700"
                                        >
                                            {specialty}
                                        </Badge>
                                    ))
                                ) : (
                                    <Badge
                                        variant="secondary"
                                        className="bg-blue-100 text-blue-700"
                                    >
                                        Không có chuyên khoa
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-600">Liên hệ:</span>
                            <span className="font-medium">
                                {doctor?.phoneNumber || 'Không có thông tin'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-600">Email:</span>
                            <span className="font-medium">
                                {doctor?.email || 'Không có thông tin'}
                            </span>
                        </div>
                    </div>

                    <div className="border-t pt-3">
                        <h4 className="font-semibold mb-2">Kinh nghiệm & Chuyên môn</h4>
                        <p className="text-sm text-gray-600">
                            {doctor?.description ||
                                'Bác sĩ có nhiều năm kinh nghiệm trong lĩnh vực chuyên môn, đã điều trị thành công nhiều ca bệnh phức tạp.'}
                        </p>
                    </div>

                    <div className="border-t pt-3">
                        <h4 className="font-semibold mb-2">Lịch khám</h4>
                        <div className="text-sm">
                            <p>
                                <span className="font-medium">Ngày:</span>{' '}
                                {selectedDate ? formatDate(selectedDate) : 'Chưa chọn ngày'}
                            </p>
                            <p>
                                <span className="font-medium">Giờ:</span> {selectedTimeSlot?.time}
                            </p>
                            <p className="mt-2 font-medium text-green-600">Phí khám: 350,000 VNĐ</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DetailDoctorModal;
