import { Receipt, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { usePaymentCalculation } from '../../Hooks/UsePaymentCalculation';
import { useSelector } from 'react-redux';
import { memo } from 'react';
import { formatCurrencyVN } from '../../Utils/Format/FormatCurrency';
import { getMedicineUnitTranslate } from '../../Utils/Translate&FormatColor/MedicineUtil';

const PaymentSummaryTab = ({ handlePayment }) => {
    const { appointmentInfo, appointmentService, prescription } = useSelector(
        state => state.AppointmentReducer
    );

    const paymentData = usePaymentCalculation();

    return (
        <Card className="shadow-sm border-slate-200 p-0">
            <CardHeader className="py-4 bg-gradient-to-r from-emerald-50 via-emerald-50 to-green-50 rounded-t-lg flex items-center justify-between">
                <CardTitle className="flex items-center gap-3 text-base font-semibold text-emerald-800">
                    <div className="p-2 bg-emerald-100 rounded-lg shadow-sm">
                        <Receipt className="h-5 w-5 text-emerald-600" />
                    </div>
                    Tổng kết và thanh toán
                </CardTitle>
            </CardHeader>

            <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Chi tiết chi phí */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                            <Receipt className="h-5 w-5" />
                            Chi tiết chi phí
                        </h3>
                        <div className="space-y-4">
                            {/* Phí khám bệnh */}
                            <div className="flex justify-between items-center py-3 border-b border-slate-200">
                                <span className="text-slate-700">Phí khám bệnh</span>
                                <span className="font-semibold text-lg">
                                    {formatCurrencyVN(paymentData.examinationFee)}
                                </span>
                            </div>

                            {/* Phí xét nghiệm */}
                            <div className="border-b border-slate-200 pb-3">
                                <div className="flex justify-between items-center py-3">
                                    <span className="text-slate-700">
                                        Phí xét nghiệm ({appointmentService.length} dịch vụ)
                                    </span>
                                    <span className="font-semibold text-lg">
                                        {formatCurrencyVN(paymentData.labFees)}
                                    </span>
                                </div>
                                <div className="ml-4 space-y-2">
                                    {appointmentService.map(service => (
                                        <div
                                            key={service.appointmentServiceId}
                                            className="flex justify-between items-center py-1"
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-sm text-slate-800">
                                                    {service.serviceName}
                                                </span>
                                            </div>
                                            <span className="text-sm text-slate-700">
                                                {formatCurrencyVN(service.price)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tiền thuốc */}
                            <div className="border-b border-slate-200 pb-3">
                                <div className="flex justify-between items-center py-3">
                                    <span className="text-slate-700">
                                        Tiền thuốc ({prescription?.prescriptionDetails.length || 0}{' '}
                                        loại)
                                    </span>
                                    <span className="font-semibold text-lg">
                                        {formatCurrencyVN(paymentData.medicationFees)}
                                    </span>
                                </div>
                                {prescription?.prescriptionDetails && (
                                    <div className="ml-4 space-y-2">
                                        {prescription.prescriptionDetails.map(med => (
                                            <div
                                                key={med.medicineId}
                                                className="flex justify-between items-center py-1"
                                            >
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-slate-800">
                                                        {med.medicineName}
                                                    </span>
                                                    <span className="text-xs text-slate-500">
                                                        {med.quantity}{' '}
                                                        {getMedicineUnitTranslate(med.unit)}
                                                    </span>
                                                </div>
                                                <span className="text-sm text-slate-700">
                                                    {formatCurrencyVN(med.price)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Tổng cộng */}
                            <div className="flex justify-between items-center py-4 border-t-2 border-emerald-200 bg-emerald-50 rounded-lg px-4">
                                <span className="text-xl font-bold text-slate-900">Tổng cộng</span>
                                <span className="text-2xl font-bold text-emerald-600">
                                    {formatCurrencyVN(paymentData.total)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Tóm tắt điều trị */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Tóm tắt điều trị
                        </h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 rounded-lg">
                                <span className="font-semibold text-slate-700 block mb-2">
                                    Kết quả khám tổng quát:
                                </span>
                                <p className="text-slate-800 leading-relaxed">
                                    {appointmentInfo?.symptoms}
                                </p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-lg">
                                <span className="font-semibold text-slate-700 block mb-2">
                                    Kết luận cuối cùng:
                                </span>
                                <p className="text-slate-800 leading-relaxed">
                                    {appointmentInfo?.generalConclusion}
                                </p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-lg">
                                <span className="font-semibold text-slate-700 block mb-2">
                                    Xét nghiệm đã chỉ định:
                                </span>
                                <p className="text-slate-800">
                                    {appointmentService.length > 0
                                        ? appointmentService.map(s => s.serviceName).join(', ')
                                        : 'Không có'}
                                </p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-lg">
                                <span className="font-semibold text-slate-700 block mb-2">
                                    Thuốc đã kê:
                                </span>
                                <p className="text-slate-800">
                                    {prescription?.prescriptionDetails.length > 0
                                        ? prescription.prescriptionDetails
                                              .map(m => m.medicineName)
                                              .join(', ')
                                        : 'Không có'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-8 border-t border-slate-200">
                    <Button
                        disabled={appointmentInfo.status != 'PendingPayment'}
                        onClick={handlePayment}
                        className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700 text-lg py-3"
                    >
                        <CheckCircle className="h-5 w-5" />
                        Thanh toán đơn khám
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default memo(PaymentSummaryTab);
