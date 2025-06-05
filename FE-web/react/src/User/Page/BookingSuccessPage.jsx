import { useLocation, useNavigate } from 'react-router-dom';
import { getDataJSONStorage } from '../../Utils/UtilFunction';
import { USER_LOGIN } from '../../Utils/Interceptor';
import {
    CheckCircle2,
    FileText,
    User,
    Calendar,
    ClipboardList,
    Info,
    Phone,
    Mail,
    Clock,
    Stethoscope,
    CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getGenderTranslate } from '../../Utils/Translate&FormatColor/GenderUlti';
import { formatDate } from '../../Utils/Format/FormatDate';

const BookingSuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { appointmentInfo } = location.state || {};
    const loggedInPatient = getDataJSONStorage(USER_LOGIN);

    if (!appointmentInfo) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex flex-col items-center justify-center py-10 px-4">
                <div className="w-full max-w-md">
                    <Alert variant="destructive" className="shadow-lg">
                        <Info className="h-4 w-4" />
                        <AlertTitle>Lỗi</AlertTitle>
                        <AlertDescription>
                            Không tìm thấy thông tin lịch hẹn. Vui lòng thử lại.
                        </AlertDescription>
                    </Alert>
                    <Button onClick={() => navigate('/booking')} className="mt-6 w-full" size="lg">
                        Quay lại đặt lịch
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-8">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-400 to-green-500 rounded-full shadow-lg mb-6 animate-pulse">
                        <CheckCircle2 className="h-14 w-14 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-3">
                        Đặt lịch thành công!
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Lịch khám của bạn đã được đặt thành công. Chúng tôi sẽ gửi thông báo xác
                        nhận qua email và tin nhắn trong thời gian sớm nhất.
                    </p>
                </div>

                {/* Main Content */}
                <div className="max-w-5xl mx-auto space-y-6">
                    {/* Appointment Summary Card */}
                    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                            <div className="flex items-center">
                                <FileText className="h-6 w-6 mr-3" />
                                <CardTitle className="text-xl font-semibold">
                                    Tóm tắt thông tin đặt lịch
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Patient Information */}
                                <div className="space-y-6">
                                    <div className="flex items-center mb-4">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                            <User className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            Thông tin bệnh nhân
                                        </h3>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 font-medium">
                                                Họ tên:
                                            </span>
                                            <span className="font-semibold text-gray-800">
                                                {loggedInPatient.FullName}
                                            </span>
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 font-medium">
                                                Ngày sinh:
                                            </span>
                                            <span className="text-gray-800">
                                                {formatDate(loggedInPatient.DateOfBirth)}
                                            </span>
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 font-medium flex items-center">
                                                <Phone className="h-4 w-4 mr-1" />
                                                Điện thoại:
                                            </span>
                                            <span className="text-gray-800">
                                                {loggedInPatient.PhoneNumber}
                                            </span>
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 font-medium flex items-center">
                                                <Mail className="h-4 w-4 mr-1" />
                                                Email:
                                            </span>
                                            <span className="text-gray-800 text-sm">
                                                {loggedInPatient.Email}
                                            </span>
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 font-medium">
                                                Giới tính:
                                            </span>
                                            <Badge variant="secondary">
                                                {getGenderTranslate(loggedInPatient.Gender)}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Appointment Information */}
                                <div className="space-y-6">
                                    <div className="flex items-center mb-4">
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                            <Calendar className="h-5 w-5 text-green-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            Thông tin lịch khám
                                        </h3>
                                    </div>

                                    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 font-medium flex items-center">
                                                <Stethoscope className="h-4 w-4 mr-1" />
                                                Chuyên khoa:
                                            </span>
                                            <Badge className="bg-blue-500 hover:bg-blue-600">
                                                {appointmentInfo.specialty.name}
                                            </Badge>
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 font-medium flex items-center">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                Ngày khám:
                                            </span>
                                            <span className="font-semibold text-gray-800">
                                                {appointmentInfo.date}
                                            </span>
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 font-medium flex items-center">
                                                <Clock className="h-4 w-4 mr-1" />
                                                Giờ khám:
                                            </span>
                                            <Badge variant="outline" className="font-semibold">
                                                {appointmentInfo.timeSlot.time}
                                            </Badge>
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 font-medium">
                                                Bác sĩ:
                                            </span>
                                            <span className="font-semibold text-gray-800">
                                                {appointmentInfo.doctor.fullName}
                                            </span>
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 font-medium flex items-center">
                                                <CreditCard className="h-4 w-4 mr-1" />
                                                Phí khám bệnh:
                                            </span>
                                            <span className="font-bold text-green-600 text-lg">
                                                350,000 VNĐ
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Reason Section */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                                    <ClipboardList className="h-5 w-5 mr-2 text-gray-600" />
                                    Lý do khám:
                                </h3>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-gray-700 leading-relaxed">
                                        {appointmentInfo.reason}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Important Notice */}
                    <Alert className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-lg">
                        <Info className="h-5 w-5 text-amber-600" />
                        <AlertTitle className="text-amber-800 font-semibold">
                            Lưu ý quan trọng
                        </AlertTitle>
                        <AlertDescription className="text-amber-700 mt-2">
                            <div className="space-y-2">
                                <p>
                                    • Vui lòng có mặt tại phòng khám <strong>15 phút trước</strong>{' '}
                                    giờ hẹn
                                </p>
                                <p>
                                    • Mang theo <strong>CMND/CCCD</strong> và các giấy tờ y tế liên
                                    quan
                                </p>
                                <p>
                                    • Vào mục <strong>Quản lý Hồ sơ y tế</strong> để theo dõi lịch
                                    khám của bạn
                                </p>
                            </div>
                        </AlertDescription>
                    </Alert>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => navigate('/booking')}
                            className="flex items-center gap-2 hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800"
                        >
                            <ClipboardList className="h-5 w-5" />
                            Đặt lịch mới
                        </Button>
                        <Button
                            size="lg"
                            onClick={() => navigate('/my-appointments')}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg"
                        >
                            <Calendar className="h-5 w-5 mr-2" />
                            Xem lịch khám của tôi
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccessPage;
