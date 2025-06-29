import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Pill } from 'lucide-react';
import { Form, Input } from 'antd';
import { useSelector } from 'react-redux';
import { formatCurrencyVN } from '../../Utils/Format/FormatCurrency';
import { useEffect } from 'react';
import { getMedicineUnitTranslate } from '../../Utils/Translate&FormatColor/MedicineUtil';

const { TextArea } = Input;

const PrescriptionTab = ({ prescriptionForm }) => {
    const { prescription } = useSelector(state => state.AppointmentReducer);

    useEffect(() => {
        if (prescription?.notes) {
            prescriptionForm.setFieldsValue({ notes: prescription.notes });
        }
    }, [prescription?.notes]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm border-slate-200 p-0">
                <CardHeader className="py-4 bg-gradient-to-r from-green-50 via-green-50 to-emerald-50 rounded-t-lg flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-base font-semibold text-gray-800">
                        <div className="p-2 bg-green-100 rounded-lg shadow-sm">
                            <Pill className="h-5 w-5 text-green-600" />
                        </div>
                        Đơn thuốc
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    {prescription?.prescriptionDetails.length > 0 ? (
                        <div className="space-y-4">
                            {prescription.prescriptionDetails.map(medication => (
                                <div
                                    key={medication.medicineId}
                                    className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-slate-900 text-lg">
                                                    {medication.medicineName}
                                                </p>
                                                {medication.medicineCode && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {medication.medicineCode}
                                                    </Badge>
                                                )}
                                            </div>
                                            {medication.medicineTypeName && (
                                                <Badge
                                                    variant="secondary"
                                                    className="text-xs w-fit"
                                                >
                                                    {medication.medicineTypeName}
                                                </Badge>
                                            )}
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-slate-600">
                                                        Số lượng:
                                                    </span>
                                                    <span className="ml-2 font-medium">
                                                        {medication.quantity}{' '}
                                                        {getMedicineUnitTranslate(medication.unit)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-600">
                                                        Cách dùng:
                                                    </span>
                                                    <span className="ml-2 font-medium">
                                                        {medication.dosageInstructions}
                                                    </span>
                                                </div>
                                                <div className="col-span-2">
                                                    <span className="text-slate-600">
                                                        Thành tiền:
                                                    </span>
                                                    <span className="ml-2 font-bold text-emerald-600">
                                                        {formatCurrencyVN(
                                                            medication.price * medication.quantity
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="p-4 bg-slate-100 rounded-full w-fit mx-auto mb-4">
                                <Pill className="h-8 w-8 text-slate-400" />
                            </div>
                            <p className="text-slate-500 text-lg">Chưa kê toa thuốc nào</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Hướng dẫn sử dụng thuốc */}
            <Card className="shadow-sm border-slate-200 p-0">
                <CardHeader className="py-4 bg-gradient-to-r from-blue-50 via-blue-50 to-indigo-50 rounded-t-lg flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-base font-semibold text-gray-800">
                        <div className="p-2 bg-blue-100 rounded-lg shadow-sm">
                            <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        Hướng dẫn sử dụng thuốc
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 space-y-4">
                    <Form form={prescriptionForm} layout="vertical">
                        <Form.Item
                            label={
                                <span className="font-medium text-gray-700">
                                    Hướng dẫn sử dụng thuốc
                                </span>
                            }
                            name="notes"
                        >
                            <TextArea rows={4} disabled={true} />
                        </Form.Item>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default memo(PrescriptionTab);
