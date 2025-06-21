import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRoleFromPath } from '../../Hooks/UseRoleFromPath';

const AppointmentOverview = () => {
    const { appointmentInfo } = useSelector(state => state.AppointmentReducer);
    const navigate = useNavigate();
    const role = useRoleFromPath();

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="pl-0">
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Stethoscope className="h-6 w-6 text-blue-600" />
                            </div>
                            Khám bệnh
                        </h1>
                        <p className="text-slate-600 mt-1 flex items-center gap-2">
                            <span className="text-sm">Mã lịch hẹn:</span>
                            <Badge variant="outline" className="font-mono">
                                {appointmentInfo?.appointmentCode}
                            </Badge>
                        </p>
                    </div>
                </div>

                <div>
                    <Button
                        variant="outline"
                        className="flex items-center gap-2 hover:bg-slate-50 transition-colors"
                        onClick={() => navigate(`/${role}`)}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default memo(AppointmentOverview);
