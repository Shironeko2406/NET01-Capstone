import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, FileText, Pill, Plus, Save, Trash2 } from 'lucide-react';
import { Form, Input } from 'antd';
import { useSelector } from 'react-redux';
import { formatCurrency } from '../../Utils/Format/FormatCurrency';

const { TextArea } = Input;

const PrescriptionTab = ({
    prescriptionForm,
    isPrescriptionSaved,
    setIsPrescriptionSaved,
    setIsPrescriptionDialogOpen,
    handleRemoveMedication,
    handleSavePrescription,
}) => {
    const { prescription } = useSelector(state => state.AppointmentReducer);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Đơn thuốc */}
            <Card className="shadow-sm border-slate-200">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Pill className="h-5 w-5 text-green-600" />
                            </div>
                            Đơn thuốc
                        </CardTitle>
                        {!isPrescriptionSaved ? (
                            <Button
                                onClick={() => setIsPrescriptionDialogOpen(true)}
                                className="gap-2 bg-green-600 hover:bg-green-700"
                            >
                                <Plus className="h-4 w-4" />
                                Thêm thuốc
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setIsPrescriptionSaved(false)}
                                variant="outline"
                                className="gap-2"
                            >
                                <Edit className="h-4 w-4" />
                                Chỉnh sửa
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    {prescription.prescriptionDetails.length > 0 ? (
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
                                                        {medication.quantity} {medication.unit}
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
                                                        {formatCurrency(
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
            <Card className="shadow-sm border-slate-200">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                    <CardTitle className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
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
                        initialValues={{
                            instructions: prescription.notes,
                        }}
                    >
                        <Form.Item label="Hướng dẫn sử dụng thuốc" name="instructions">
                            <TextArea
                                rows={6}
                                placeholder="Hướng dẫn cách sử dụng thuốc, lưu ý đặc biệt..."
                                disabled={isPrescriptionSaved}
                                className="resize-none focus:ring-2 focus:ring-blue-500"
                            />
                        </Form.Item>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default memo(PrescriptionTab);
