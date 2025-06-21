import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { GetAppointmentDetailByIdActionAsync } from '../../Redux/ReducerAPI/AppointmentReducer';
import AppointmentOverview from '../../Doctor/Components/AppointmentOverview';
import AppointmentInfoDetailCard from '../../Doctor/Components/AppointmentInfoDetailCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    getAppointmentServiceStatusColor,
    getAppointmentServiceStatusLabel,
} from '../../Utils/Translate&FormatColor/AppointmentServiceUtil';
import { formatDate, formatDateTime } from '../../Utils/Format/FormatDate';
import { Form } from 'antd';
import UpdateTestResultModal from '../Modal/UpdateTestResultModal';
import { useAsyncAction } from '../../Hooks/UseAsyncAction';
import { UpdateTestResultByIdActionAsync } from '../../Redux/ReducerAPI/TestResultReducer';
import { UpdateStatusLabServicesByIdActionAsync } from '../../Redux/ReducerAPI/AppointmentServiceReducer';

const TestResultOfAppointment = () => {
    const [form] = Form.useForm();
    const { appointmentId } = useParams();
    const dispatch = useDispatch();
    const { appointmentService } = useSelector(state => state.AppointmentReducer);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const { run } = useAsyncAction();

    useEffect(() => {
        dispatch(GetAppointmentDetailByIdActionAsync(appointmentId));
    }, [appointmentId]);

    const handleUpdateResult = service => {
        setSelectedService(service);
        form.setFieldsValue({
            result: service.testResult?.result || '',
        });
        setDialogOpen(true);
    };

    const handleCompleteTest = serviceId => {
        run(
            UpdateStatusLabServicesByIdActionAsync(serviceId, 'Completed', appointmentId),
            () => {}
        );
    };

    const handleSubmitResult = values => {
        run(
            UpdateTestResultByIdActionAsync(
                selectedService.testResult.testResultId,
                values,
                appointmentId
            ),
            () => {
                setDialogOpen(false);
                setSelectedService(null);
                form.resetFields();
            }
        );
    };
    return (
        <div className="mx-auto space-y-6">
            <AppointmentOverview />

            <AppointmentInfoDetailCard />

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-3">
                <div className="border-b border-gray-200 px-1 py-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-semibold">Danh sách dịch vụ xét nghiệm</h3>
                        <Badge variant="secondary" className="text-xs">
                            {appointmentService.length} dịch vụ
                        </Badge>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-[1000px] w-full table-auto">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Dịch vụ
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Kết quả
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Ngày tạo KQ
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Người tạo
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {appointmentService?.map(service => (
                                <tr key={service.appointmentServiceId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div className="font-medium">{service.serviceName}</div>
                                        {service.note && (
                                            <div className="text-xs text-blue-600 mt-1">
                                                Ghi chú: {service.note}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge
                                            className={`text-xs ${getAppointmentServiceStatusColor(
                                                service.status
                                            )}`}
                                            variant="secondary"
                                        >
                                            {getAppointmentServiceStatusLabel(service.status)}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {service.testResult?.result ? (
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 max-w-xs">
                                                <div className="font-semibold text-green-800 mb-2">
                                                    Kết quả:
                                                </div>
                                                <div className="text-sm text-green-800 whitespace-pre-wrap mb-3">
                                                    {service.testResult.result}
                                                </div>
                                                <div className="border-t border-green-200 pt-2 mt-2 flex justify-between text-xs text-gray-500">
                                                    <span>
                                                        {formatDateTime(
                                                            service.testResult?.resultDate
                                                        )}
                                                    </span>
                                                    <span>
                                                        {service.testResult?.createdBy || '-'}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 italic">
                                                Chưa có kết quả
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {service?.testResult?.resultDate
                                            ? formatDate(service.testResult.resultDate)
                                            : '-'}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {service.testResult?.createdBy || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-1">
                                            {service.status === 'Assigned' ? (
                                                <div className="text-xs text-red-500 italic">
                                                    Chưa yêu cầu
                                                </div>
                                            ) : service.status === 'Completed' ? null : (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>
                                                            Thao tác
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleUpdateResult(service)
                                                            }
                                                        >
                                                            Cập nhật kết quả
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleCompleteTest(
                                                                    service.appointmentServiceId
                                                                )
                                                            }
                                                        >
                                                            Hoàn thành xét nghiệm
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {(!appointmentService || appointmentService.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                        <p>Không có dịch vụ xét nghiệm nào</p>
                    </div>
                )}
            </div>

            <UpdateTestResultModal
                dialogOpen={dialogOpen}
                setDialogOpen={setDialogOpen}
                selectedService={selectedService}
                form={form}
                handleSubmitResult={handleSubmitResult}
            />
        </div>
    );
};

export default TestResultOfAppointment;
