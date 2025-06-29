import React, { memo } from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Pill, Receipt, Stethoscope, TestTube } from 'lucide-react';

const AppointmentStepTabs = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2">
            <TabsList className="grid w-full grid-cols-5 bg-slate-50 p-1 rounded-lg">
                <TabsTrigger
                    value="examination"
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                    <Stethoscope className="h-4 w-4" />
                    <span className="hidden sm:inline">Khám bệnh</span>
                </TabsTrigger>

                <TabsTrigger
                    value="lab-services"
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                    <TestTube className="h-4 w-4" />
                    <span className="hidden sm:inline">Chỉ định XN</span>
                </TabsTrigger>

                <TabsTrigger
                    value="diagnosis"
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">Kết luận</span>
                </TabsTrigger>

                <TabsTrigger
                    value="prescription"
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                    <Pill className="h-4 w-4" />
                    <span className="hidden sm:inline">Kê toa</span>
                </TabsTrigger>

                <TabsTrigger
                    value="payment"
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                    <Receipt className="h-4 w-4" />
                    <span className="hidden sm:inline">Thanh toán</span>
                </TabsTrigger>
            </TabsList>
        </div>
    );
};

export default memo(AppointmentStepTabs);
