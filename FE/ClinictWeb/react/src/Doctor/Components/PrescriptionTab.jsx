import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, FileText, Pill, Plus, Save, Trash2 } from 'lucide-react';
import { Form, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { formatCurrencyVN } from '../../Utils/Format/FormatCurrency';
import { setIsPrescriptionSaved } from '../../Redux/ReducerAPI/AppointmentReducer';
import { useEffect } from 'react';
import { getMedicineUnitTranslate } from '../../Utils/Translate&FormatColor/MedicineUtil';

const { TextArea } = Input;

const PrescriptionTab = ({
    prescriptionForm,
    setIsPrescriptionDialogOpen,
    handleRemoveMedication,
    handleSavePrescription,
}) => {
    const { appointmentInfo, prescription, isPrescriptionSaved } = useSelector(
        state => state.AppointmentReducer
    );
    const dispatch = useDispatch();

    useEffect(() => {
        if (prescription?.notes) {
            prescriptionForm.setFieldsValue({ notes: prescription.notes });
        }
    }, [prescription?.notes]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Đơn thuốc */}
            <Card className="shadow-sm border-slate-200 p-0">
                <CardHeader className="py-4 bg-gradient-to-r from-green-50 via-green-50 to-emerald-50 rounded-t-lg flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-base font-semibold text-gray-800">
                        <div className="p-2 bg-green-100 rounded-lg shadow-sm">
                            <Pill className="h-5 w-5 text-green-600" />
                        </div>
                        Đơn thuốc
                    </CardTitle>
                    {appointmentInfo.status === 'InProgress' &&
                        (!isPrescriptionSaved ? (
                            <Button
                                onClick={() => setIsPrescriptionDialogOpen(true)}
                                className="gap-2 bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 shadow-md transition-all duration-200 hover:shadow-lg"
                            >
                                <Plus className="h-4 w-4" />
                                Thêm thuốc
                            </Button>
                        ) : (
                            <Button
                                onClick={() => dispatch(setIsPrescriptionSaved(false))}
                                variant="outline"
                                className="gap-2 border-green-600 text-green-600 hover:bg-green-50 shadow-md transition-all duration-200 hover:shadow-lg"
                            >
                                <Edit className="h-4 w-4" />
                                Chỉnh sửa
                            </Button>
                        ))}
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
                                        {!isPrescriptionSaved && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleRemoveMedication(medication.medicineId)
                                                }
                                                className="text-red-600 hover:bg-red-50 hover:border-red-200"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {!isPrescriptionSaved && (
                                <Button
                                    onClick={() => prescriptionForm.submit()}
                                    className="gap-2 mt-4 w-full bg-green-600 hover:bg-green-700"
                                >
                                    <Save className="h-4 w-4" />
                                    Lưu đơn thuốc
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="p-4 bg-slate-100 rounded-full w-fit mx-auto mb-4">
                                <Pill className="h-8 w-8 text-slate-400" />
                            </div>
                            <p className="text-slate-500 text-lg">Chưa kê toa thuốc nào</p>
                            <p className="text-slate-400 text-sm mt-1">
                                Nhấn "Thêm thuốc" để bắt đầu
                            </p>
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
                <CardContent className="p-6 space-y-4">
                    <Form
                        form={prescriptionForm}
                        layout="vertical"
                        onFinish={handleSavePrescription}
                    >
                        <Form.Item
                            label={
                                <span className="font-medium text-gray-700">
                                    Hướng dẫn sử dụng thuốc
                                </span>
                            }
                            name="notes"
                        >
                            <TextArea
                                rows={4}
                                placeholder="Hướng dẫn cách sử dụng thuốc, lưu ý đặc biệt..."
                                disabled={isPrescriptionSaved}
                            />
                        </Form.Item>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default memo(PrescriptionTab);
