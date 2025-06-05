import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    ArrowLeft,
    Check,
    Clock,
    User,
    CalendarIcon,
    Stethoscope,
    FileText,
    Phone,
    Mail,
    Calendar,
    Info,
    ChevronRight,
} from 'lucide-react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { stepTitles, timeSlots } from '../../Utils/Data/BookingData';
import { useDispatch, useSelector } from 'react-redux';
import { GetSpecialtiesActionAsync } from '../../Redux/ReducerAPI/SpecialtyReducer';
import { formatDate } from '../../Utils/Format/FormatDate';
import { GetDoctorAvailableActionAsync } from '../../Redux/ReducerAPI/UsersReducer';
import { getDataJSONStorage } from '../../Utils/UtilFunction';
import { USER_LOGIN } from '../../Utils/Interceptor';
import { getGenderTranslate } from '../../Utils/Translate&FormatColor/GenderUlti';
import { getGenderIcon } from '../../Utils/Translate&FormatColor/RoleUtil';
import DetailDoctorModal from '../Modal/DetailDoctorModal';
import { useAsyncAction } from '../../Hooks/UseAsyncAction';
import { useNavigate } from 'react-router-dom';
import { CreateAppointmentActionAsync } from '../../Redux/ReducerAPI/AppointmentReducer';

const BookingPage = () => {
    const { specialties } = useSelector(state => state.SpecialtyReducer);
    const { doctors } = useSelector(state => state.UsersReducer);
    const dispatch = useDispatch();
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedSpecialty, setSelectedSpecialty] = useState(null);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDoctorForModal, setSelectedDoctorForModal] = useState({});
    const [patientInfo, setPatientInfo] = useState({
        reason: '',
    });
    const [openDetailDoctor, setOpenDetailDoctor] = useState(false);
    const loggedInPatient = getDataJSONStorage(USER_LOGIN);
    const { run } = useAsyncAction();
    const navigate = useNavigate();

    useEffect(() => {
        if (!specialties.length) {
            dispatch(GetSpecialtiesActionAsync());
        }

        if (currentStep === 4 && selectedSpecialty && selectedDate && selectedTimeSlot) {
            const filter = {
                specialtyId: selectedSpecialty.specialtyId,
                date: selectedDate.format('YYYY-MM-DD'),
                startTime: selectedTimeSlot.startTime,
                endTime: selectedTimeSlot.endTime,
            };
            dispatch(GetDoctorAvailableActionAsync(filter));
        }
    }, [currentStep, selectedSpecialty, selectedDate, selectedTimeSlot, dispatch]);

    const handleNext = () => {
        if (currentStep < 5) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return selectedSpecialty !== null;
            case 2:
                return selectedDate !== null;
            case 3:
                return selectedTimeSlot !== null;
            case 4:
                return selectedDoctor !== null;
            case 5:
                return patientInfo.reason.trim() !== '';
            default:
                return false;
        }
    };

    const handleBooking = () => {
        const newAppointment = {
            doctorId: selectedDoctor.userId,
            specialtyId: selectedSpecialty.specialtyId,
            appointmentDate: selectedDate.format('YYYY-MM-DD'),
            startTime: selectedTimeSlot.startTime,
            endTime: selectedTimeSlot.endTime,
            note: patientInfo.reason,
        };

        const appointmentInfo = {
            specialty: selectedSpecialty,
            date: selectedDate.format('YYYY-MM-DD'),
            timeSlot: selectedTimeSlot,
            doctor: selectedDoctor,
            reason: patientInfo.reason,
        };

        run(CreateAppointmentActionAsync(newAppointment), () => {
            navigate('/booking/success', {
                state: {
                    appointmentInfo,
                },
            });
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <div className="container mx-auto px-2 py-4">
                {/* Progress Steps - Improved styling to match reference */}
                <div className="flex items-center justify-center mb-6 overflow-x-auto px-4">
                    <div className="flex items-center justify-center min-w-max">
                        {[1, 2, 3, 4, 5].map(step => (
                            <div key={step} className="flex items-center">
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                                            currentStep >= step
                                                ? 'bg-blue-500 border-blue-500 text-white shadow-lg'
                                                : currentStep === step
                                                ? 'bg-blue-500 border-blue-500 text-white shadow-lg'
                                                : 'border-gray-300 text-gray-400 bg-white'
                                        }`}
                                    >
                                        {currentStep > step ? (
                                            <Check className="h-6 w-6 font-bold" />
                                        ) : (
                                            <span className="text-lg font-semibold">{step}</span>
                                        )}
                                    </div>
                                    <div className="mt-2 text-center">
                                        <span
                                            className={`text-sm font-medium whitespace-nowrap ${
                                                currentStep >= step
                                                    ? 'text-blue-600'
                                                    : 'text-gray-500'
                                            }`}
                                        >
                                            {stepTitles[step - 1]}
                                        </span>
                                    </div>
                                </div>
                                {step < 5 && (
                                    <div
                                        className={`w-16 md:w-24 h-1 mx-4 rounded-full transition-all duration-300 ${
                                            currentStep > step ? 'bg-blue-500' : 'bg-gray-300'
                                        }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="max-w-4xl mx-auto">
                    {currentStep === 1 && (
                        <Card className="shadow-sm">
                            <CardHeader className="text-center py-3">
                                <CardTitle className="text-xl">Chọn chuyên khoa</CardTitle>
                                <CardDescription className="text-sm">
                                    Vui lòng chọn chuyên khoa bạn muốn khám
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pb-4">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                    {specialties.map(specialty => (
                                        <Card
                                            key={specialty.specialtyId}
                                            className={`cursor-pointer transition-all hover:shadow-md ${
                                                selectedSpecialty?.selectedSpecialty ===
                                                specialty.specialtyId
                                                    ? 'ring-2 ring-blue-500 bg-blue-50'
                                                    : 'hover:bg-gray-50'
                                            }`}
                                            onClick={() => setSelectedSpecialty(specialty)}
                                        >
                                            <CardContent className="p-3 text-center">
                                                <h3 className="font-semibold text-sm mb-1">
                                                    {specialty.name}
                                                </h3>
                                                <p className="text-xs text-gray-600 line-clamp-2">
                                                    {specialty.description}
                                                </p>
                                                {selectedSpecialty?.specialtyId ===
                                                    specialty.specialtyId && (
                                                    <Badge className="mt-2 bg-blue-500 text-xs py-0">
                                                        <Check className="h-2 w-2 mr-1" />
                                                        Đã chọn
                                                    </Badge>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {currentStep === 2 && (
                        <Card className="shadow-sm">
                            <CardHeader className="text-center py-3">
                                <CardTitle className="text-xl">Chọn ngày khám</CardTitle>
                                <CardDescription className="text-sm">
                                    Chuyên khoa:{' '}
                                    <span className="font-semibold text-blue-600">
                                        {selectedSpecialty.name}
                                    </span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex justify-center pb-4">
                                <DatePicker
                                    value={selectedDate}
                                    onChange={date => setSelectedDate(date)}
                                    dateFormat="dd/MM/yyyy"
                                    className="rounded-md border"
                                    style={{ width: '100%', maxWidth: '300px' }}
                                />
                            </CardContent>
                        </Card>
                    )}

                    {currentStep === 3 && (
                        <Card className="shadow-sm">
                            <CardHeader className="text-center py-3">
                                <CardTitle className="text-xl">Chọn giờ khám</CardTitle>
                                <CardDescription className="text-sm">
                                    <div className="flex items-center justify-center gap-3 mt-1 flex-wrap">
                                        <span className="flex items-center gap-1 text-xs">
                                            <User className="h-3 w-3" />
                                            {selectedSpecialty.name}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs">
                                            <CalendarIcon className="h-3 w-3" />
                                            {formatDate(selectedDate)}
                                        </span>
                                    </div>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pb-4">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-w-2xl mx-auto">
                                    {timeSlots.map(slot => (
                                        <Card
                                            key={slot.id}
                                            className={`cursor-pointer transition-all ${
                                                selectedTimeSlot?.id === slot.id
                                                    ? 'ring-2 ring-blue-500 bg-blue-50'
                                                    : 'hover:bg-gray-50 hover:shadow-md'
                                            }`}
                                            onClick={() => setSelectedTimeSlot(slot)}
                                        >
                                            <CardContent className="p-3 text-center">
                                                <Clock className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                                                <h3 className="font-semibold text-sm mb-1">
                                                    {slot.time}
                                                </h3>
                                                {selectedTimeSlot?.id === slot.id ? (
                                                    <Badge className="bg-blue-500 text-xs py-0">
                                                        <Check className="h-2 w-2 mr-1" />
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
                            </CardContent>
                        </Card>
                    )}

                    {currentStep === 4 && (
                        <Card className="shadow-sm">
                            <CardHeader className="text-center py-3">
                                <CardTitle className="text-xl">Chọn bác sĩ</CardTitle>
                                <CardDescription className="text-sm">
                                    <div className="flex items-center justify-center gap-3 mt-1 flex-wrap">
                                        <span className="flex items-center gap-1 text-xs">
                                            <User className="h-3 w-3" />
                                            {selectedSpecialty.name}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs">
                                            <CalendarIcon className="h-3 w-3" />
                                            {formatDate(selectedDate)}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs">
                                            <Clock className="h-3 w-3" />
                                            {selectedTimeSlot.time}
                                        </span>
                                    </div>
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="pb-4">
                                {doctors.length === 0 ? (
                                    <div className="text-center py-6">
                                        <Stethoscope className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                                        <p className="text-gray-500 text-base mb-1">
                                            Không có bác sĩ khả dụng
                                        </p>
                                        <p className="text-gray-400 text-xs">
                                            Vui lòng thử chọn ngày hoặc giờ khác
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="text-center mb-3">
                                            <p className="text-xs text-gray-600">
                                                Có{' '}
                                                <span className="font-bold text-blue-600">
                                                    {doctors.length}
                                                </span>{' '}
                                                bác sĩ khả dụng
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-5xl mx-auto">
                                            {doctors.map(doctor => (
                                                <Card
                                                    key={doctor.userId}
                                                    className={`cursor-pointer transition-all duration-300 hover:shadow-md border ${
                                                        selectedDoctor?.userId === doctor.userId
                                                            ? 'ring-2 ring-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300'
                                                            : 'hover:bg-gray-50 border-gray-200 hover:border-blue-200'
                                                    }`}
                                                    onClick={() => setSelectedDoctor(doctor)}
                                                >
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            {/* Avatar Section - Compact */}
                                                            <div className="flex-shrink-0">
                                                                {doctor.avatar ? (
                                                                    <div className="relative">
                                                                        <img
                                                                            src={
                                                                                doctor.avatar ||
                                                                                '/placeholder.svg'
                                                                            }
                                                                            alt={doctor.fullName}
                                                                            className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-sm"
                                                                        />
                                                                        <div className="absolute -bottom-1 -right-1 bg-green-500 h-4 w-4 rounded-full border-2 border-white"></div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                                                                        <Stethoscope className="h-7 w-7 text-white" />
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Doctor Info Section - More compact */}
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-start justify-between">
                                                                    <div className="flex-1">
                                                                        <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                                                                            BS. {doctor.fullName}
                                                                        </h3>

                                                                        {/* Specialties - Inline badges */}
                                                                        <div className="flex flex-wrap gap-1 mb-2">
                                                                            {doctor.specialties
                                                                                .slice(0, 2)
                                                                                .map(
                                                                                    (
                                                                                        specialty,
                                                                                        index
                                                                                    ) => (
                                                                                        <Badge
                                                                                            key={
                                                                                                index
                                                                                            }
                                                                                            variant="secondary"
                                                                                            className="text-xs py-0 px-2 bg-blue-100 text-blue-700"
                                                                                        >
                                                                                            {
                                                                                                specialty
                                                                                            }
                                                                                        </Badge>
                                                                                    )
                                                                                )}
                                                                        </div>

                                                                        {/* Contact and Price in one line */}
                                                                        <div className="flex items-center justify-between text-sm mb-2">
                                                                            <div className="flex items-center gap-1">
                                                                                <Phone className="h-3 w-3 text-gray-400" />
                                                                                <span className="text-gray-600">
                                                                                    Liên hệ:
                                                                                </span>
                                                                                <span className="font-medium text-gray-800">
                                                                                    {
                                                                                        doctor.phoneNumber
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex items-center gap-1">
                                                                                <span className="text-green-600 font-bold">
                                                                                    350,000 VNĐ
                                                                                </span>
                                                                            </div>
                                                                        </div>

                                                                        {/* Action buttons row */}
                                                                        <div className="flex items-center justify-between">
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="text-xs py-1 h-7 px-3"
                                                                                onClick={e => {
                                                                                    e.stopPropagation();
                                                                                    setOpenDetailDoctor(
                                                                                        true
                                                                                    );
                                                                                    setSelectedDoctorForModal(
                                                                                        doctor
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <Info className="h-3 w-3 mr-1" />
                                                                                Xem chi tiết
                                                                            </Button>

                                                                            <div className="flex items-center gap-2">
                                                                                {selectedDoctor?.userId ===
                                                                                doctor.userId ? (
                                                                                    <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-2">
                                                                                        <Check className="h-3 w-3 mr-1" />
                                                                                        Đã chọn
                                                                                    </Badge>
                                                                                ) : (
                                                                                    <div className="flex items-center gap-1">
                                                                                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                                                                                        <span className="text-xs text-green-600 font-medium">
                                                                                            Sẵn sàng
                                                                                        </span>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>

                                        {/* Additional Info - More compact */}
                                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs">
                                            <div className="flex items-start gap-2">
                                                <div className="bg-blue-500 p-1.5 rounded-full">
                                                    <FileText className="h-3 w-3 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-blue-800 mb-1 text-sm">
                                                        Lưu ý quan trọng
                                                    </h4>
                                                    <ul className="text-xs text-blue-700 space-y-0.5">
                                                        <li>
                                                            • Vui lòng đến trước{' '}
                                                            <span className="font-bold">
                                                                15 phút
                                                            </span>{' '}
                                                            so với giờ hẹn
                                                        </li>
                                                        <li>
                                                            • Mang theo{' '}
                                                            <span className="font-bold">
                                                                CMND/CCCD
                                                            </span>{' '}
                                                            và các giấy tờ y tế liên quan
                                                        </li>
                                                        <li>
                                                            • Có thể thay đổi lịch hẹn trước{' '}
                                                            <span className="font-bold">2 giờ</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {currentStep === 5 && (
                        <div className="space-y-4">
                            <Card className="shadow-sm">
                                <CardHeader className="py-3">
                                    <CardTitle className="text-lg">Lý do khám bệnh</CardTitle>
                                    <CardDescription className="text-xs">
                                        Vui lòng mô tả triệu chứng hoặc lý do bạn muốn khám bệnh
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pb-4">
                                    <div>
                                        <Label htmlFor="reason" className="text-sm">
                                            Lý do khám *
                                        </Label>
                                        <Textarea
                                            id="reason"
                                            value={patientInfo.reason}
                                            onChange={e =>
                                                setPatientInfo({ reason: e.target.value })
                                            }
                                            placeholder="Mô tả triệu chứng hoặc lý do khám bệnh (ví dụ: đau ngực, khó thở, khám định kỳ...)"
                                            rows={3}
                                            className="mt-1 text-sm"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
                                <CardHeader className="py-3">
                                    <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Tóm tắt thông tin đặt lịch
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pb-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-gray-800 border-b pb-1 text-sm">
                                                Thông tin bệnh nhân
                                            </h4>
                                            <div className="space-y-1 text-xs">
                                                <div className="flex items-center gap-1">
                                                    <User className="h-3 w-3 text-gray-500" />
                                                    <span className="text-gray-600">Họ tên:</span>
                                                    <span className="font-medium">
                                                        {loggedInPatient.FullName}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3 text-gray-500" />
                                                    <span className="text-gray-600">
                                                        Ngày sinh:
                                                    </span>
                                                    <span className="font-medium">
                                                        {formatDate(loggedInPatient.DateOfBirth)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Phone className="h-3 w-3 text-gray-500" />
                                                    <span className="text-gray-600">
                                                        Điện thoại:
                                                    </span>
                                                    <span className="font-medium">
                                                        {loggedInPatient.PhoneNumber}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Mail className="h-3 w-3 text-gray-500" />
                                                    <span className="text-gray-600">Email:</span>
                                                    <span className="font-medium">
                                                        {loggedInPatient.Email}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {getGenderIcon(loggedInPatient.Gender)}
                                                    <span className="text-gray-600">
                                                        Giới tính:
                                                    </span>
                                                    <span className="font-medium">
                                                        {getGenderTranslate(loggedInPatient.Gender)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-gray-800 border-b pb-1 text-sm">
                                                Thông tin lịch khám
                                            </h4>
                                            <div className="space-y-1 text-xs">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">
                                                        Chuyên khoa:
                                                    </span>
                                                    <span className="font-medium">
                                                        {selectedSpecialty.name}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">
                                                        Ngày khám:
                                                    </span>
                                                    <span className="font-medium">
                                                        {formatDate(selectedDate)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Giờ khám:</span>
                                                    <span className="font-medium">
                                                        {selectedTimeSlot.time}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Bác sĩ:</span>
                                                    <span className="font-medium">
                                                        {selectedDoctor.fullName}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between pt-1 border-t">
                                                    <span className="text-gray-600 font-medium">
                                                        Chi phí khám:
                                                    </span>
                                                    <span className="font-bold text-blue-600 text-sm">
                                                        350,000 VNĐ
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {patientInfo.reason && (
                                        <div className="mt-3 pt-2 border-t">
                                            <h4 className="font-semibold text-gray-800 mb-1 text-sm">
                                                Lý do khám:
                                            </h4>
                                            <p className="text-xs text-gray-700 bg-white p-2 rounded-lg border">
                                                {patientInfo.reason}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    <div className="flex justify-between mt-4">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            disabled={currentStep === 1}
                            className="flex items-center gap-1 text-sm h-9"
                            size="sm"
                        >
                            <ArrowLeft className="h-3 w-3" />
                            Quay lại
                        </Button>

                        {currentStep < 5 ? (
                            <Button
                                onClick={handleNext}
                                disabled={!canProceed()}
                                className="bg-blue-500 hover:bg-blue-600 text-sm h-9"
                                size="sm"
                            >
                                Tiếp tục
                                <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                        ) : (
                            <Button
                                disabled={!canProceed()}
                                onClick={handleBooking}
                                className="bg-green-500 hover:bg-green-600 px-6 text-sm h-9"
                                size="sm"
                            >
                                Xác nhận đặt lịch
                            </Button>
                        )}
                    </div>

                    {currentStep > 1 && currentStep < 5 && (
                        <Card className="mt-4 bg-blue-50 border-blue-200 shadow-sm">
                            <CardHeader className="py-2">
                                <CardTitle className="text-sm text-blue-800">
                                    Thông tin đã chọn
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="py-2">
                                <div className="space-y-1 text-xs">
                                    {selectedSpecialty && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Chuyên khoa:</span>
                                            <span className="font-semibold">
                                                {selectedSpecialty.name}
                                            </span>
                                        </div>
                                    )}
                                    {selectedDate && currentStep > 2 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Ngày khám:</span>
                                            <span className="font-semibold">
                                                {formatDate(selectedDate)}
                                            </span>
                                        </div>
                                    )}
                                    {selectedTimeSlot && currentStep > 3 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Giờ khám:</span>
                                            <span className="font-semibold">
                                                {selectedTimeSlot.time}
                                            </span>
                                        </div>
                                    )}
                                    {selectedDoctor && currentStep >= 4 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Bác sĩ:</span>
                                            <span className="font-semibold">
                                                BS. {selectedDoctor.fullName}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            <DetailDoctorModal
                open={openDetailDoctor}
                onOpenChange={setOpenDetailDoctor}
                doctor={selectedDoctorForModal}
                selectedDate={selectedDate}
                selectedTimeSlot={selectedTimeSlot}
            />
        </div>
    );
};

export default BookingPage;
