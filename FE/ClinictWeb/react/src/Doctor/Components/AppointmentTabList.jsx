import React, { memo } from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useSelector } from 'react-redux';

const AppointmentTabList = () => {
    const { appointmentStatistic } = useSelector(state => state.StatisticReducer);

    return (
        <div className="w-full">
            <TabsList className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-1 h-auto p-1 bg-gray-50 rounded-lg">
                <TabsTrigger
                    value=""
                    className="flex flex-col sm:flex-row items-center justify-center gap-1 p-3 text-xs sm:text-sm bg-white border border-gray-200 hover:bg-gray-50 data-[state=active]:bg-gray-100 data-[state=active]:border-gray-300 data-[state=active]:shadow-sm transition-all rounded-md w-full"
                >
                    <span>Tất cả</span>
                    <Badge className="bg-gray-600 hover:bg-gray-700 text-white text-xs">
                        {appointmentStatistic?.total}
                    </Badge>
                </TabsTrigger>

                <TabsTrigger
                    value="Booked"
                    className="flex flex-col sm:flex-row items-center justify-center gap-1 p-3 text-xs sm:text-sm bg-green-50 border border-green-200 hover:bg-green-100 data-[state=active]:bg-green-100 data-[state=active]:border-green-300 data-[state=active]:shadow-sm transition-all rounded-md w-full"
                >
                    <span>Đã đặt lịch</span>
                    <Badge className="bg-green-600 hover:bg-green-700 text-white text-xs">
                        {appointmentStatistic?.bookedCount}
                    </Badge>
                </TabsTrigger>

                <TabsTrigger
                    value="Waiting"
                    className="flex flex-col sm:flex-row items-center justify-center gap-1 p-3 text-xs sm:text-sm bg-yellow-50 border border-yellow-200 hover:bg-yellow-100 data-[state=active]:bg-yellow-100 data-[state=active]:border-yellow-300 data-[state=active]:shadow-sm transition-all rounded-md w-full"
                >
                    <span>Chờ khám</span>
                    <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black text-xs">
                        {appointmentStatistic?.waitingCount}
                    </Badge>
                </TabsTrigger>

                <TabsTrigger
                    value="InProgress"
                    className="flex flex-col sm:flex-row items-center justify-center gap-1 p-3 text-xs sm:text-sm bg-blue-50 border border-blue-200 hover:bg-blue-100 data-[state=active]:bg-blue-100 data-[state=active]:border-blue-300 data-[state=active]:shadow-sm transition-all rounded-md w-full"
                >
                    <span>Đang khám</span>
                    <Badge className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                        {appointmentStatistic?.inProgressCount}
                    </Badge>
                </TabsTrigger>

                <TabsTrigger
                    value="PendingPayment"
                    className="flex flex-col sm:flex-row items-center justify-center gap-1 p-3 text-xs sm:text-sm bg-orange-50 border border-orange-200 hover:bg-orange-100 data-[state=active]:bg-orange-100 data-[state=active]:border-orange-300 data-[state=active]:shadow-sm transition-all rounded-md w-full"
                >
                    <span>Chờ thanh toán</span>
                    <Badge className="bg-orange-500 hover:bg-orange-600 text-white text-xs">
                        {appointmentStatistic?.pendingPaymentCount}
                    </Badge>
                </TabsTrigger>

                <TabsTrigger
                    value="Completed"
                    className="flex flex-col sm:flex-row items-center justify-center gap-1 p-3 text-xs sm:text-sm bg-gray-100 border border-gray-300 hover:bg-gray-200 data-[state=active]:bg-gray-200 data-[state=active]:border-gray-400 data-[state=active]:shadow-sm transition-all rounded-md w-full"
                >
                    <span>Hoàn thành</span>
                    <Badge className="bg-gray-600 hover:bg-gray-700 text-white text-xs">
                        {appointmentStatistic?.completedCount}
                    </Badge>
                </TabsTrigger>

                <TabsTrigger
                    value="Cancelled"
                    className="flex flex-col sm:flex-row items-center justify-center gap-1 p-3 text-xs sm:text-sm bg-red-50 border border-red-200 hover:bg-red-100 data-[state=active]:bg-red-100 data-[state=active]:border-red-300 data-[state=active]:shadow-sm transition-all rounded-md w-full"
                >
                    <span>Hủy lịch</span>
                    <Badge className="bg-red-600 hover:bg-red-700 text-white text-xs">
                        {appointmentStatistic?.cancelledCount}
                    </Badge>
                </TabsTrigger>
            </TabsList>
        </div>
    );
};

export default memo(AppointmentTabList);
