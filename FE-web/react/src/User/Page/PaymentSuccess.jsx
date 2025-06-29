import React from 'react';
import { CheckCircle, Home, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    return (
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 max-w-md">
            <div className="text-center space-y-6">
                {/* Success Icon */}
                <div className="flex justify-center">
                    <div className="rounded-full bg-green-100 p-6">
                        <CheckCircle className="h-16 w-16 text-green-600" />
                    </div>
                </div>

                {/* Success Message */}
                <div className="space-y-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Thanh toán thành công!
                    </h1>
                    <p className="text-gray-600">Lịch hẹn của bạn đã được xác nhận thành công</p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                    <Button
                        className="w-full flex items-center justify-center bg-gradient-to-r from-sky-500 to-blue-600"
                        onClick={() => navigate('/appointment')}
                    >
                        <Calendar className="h-4 w-4" />
                        Xem lịch hẹn của tôi
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full flex items-center justify-center border-sky-200 text-sky-700 hover:bg-sky-50 hover:border-sky-300 font-medium"
                        onClick={() => navigate('/')}
                    >
                        <Home className="h-4 w-4" />
                        Về trang chủ
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
