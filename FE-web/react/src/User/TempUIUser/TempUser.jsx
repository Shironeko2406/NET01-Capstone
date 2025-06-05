import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { Outlet } from 'react-router-dom';

const TempUser = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
            {/* Header */}
            <Header />

            {/* Hero Section */}
            {/* <div className="relative py-16 md:py-24 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50"></div>
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-10 left-10 w-20 h-20 bg-sky-200 rounded-full blur-xl"></div>
                    <div className="absolute top-32 right-20 w-32 h-32 bg-blue-200 rounded-full blur-xl"></div>
                    <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-indigo-200 rounded-full blur-xl"></div>
                </div>

                <div className="container mx-auto text-center relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <Badge className="mb-4 bg-sky-100 text-sky-800 hover:bg-sky-100 px-3 py-1 text-xs font-medium border-sky-200">
                            Hệ thống quản lý phòng khám hiện đại
                        </Badge>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            Quản lý phòng khám
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600 block mt-1">
                                thông minh & hiệu quả
                            </span>
                        </h1>

                        <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed px-4">
                            Hệ thống toàn diện từ đặt lịch khám, quản lý bệnh nhân, kê toa thuốc đến
                            thống kê doanh thu. Giúp phòng khám hoạt động chuyên nghiệp và hiệu quả
                            hơn.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                            >
                                Bắt đầu sử dụng
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="px-8 py-3 font-semibold border-sky-200 text-sky-700 hover:bg-sky-50 w-full sm:w-auto"
                            >
                                Xem demo hệ thống
                            </Button>
                        </div>
                    </div>
                </div>
            </div> */}
            <Outlet />

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default TempUser;
