import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Save, CheckCircle, FileText } from 'lucide-react';
import { Form, Input } from 'antd';
import { Label } from '@/components/ui/label';

const { TextArea } = Input;

const DiagnosisTab = ({
    diagnosisForm,
    isDiagnosisSaved,
    setIsDiagnosisSaved,
    handleSaveDiagnosis,
}) => {
    const { appointmentInfo } = useSelector(state => state.AppointmentReducer);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form kết luận */}
            <Card className="shadow-sm border-slate-200">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 rounded-t-lg">
                    <CardTitle className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <FileText className="h-5 w-5 text-orange-600" />
                        </div>
                        Kết luận cuối cùng
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <Form
                        form={diagnosisForm}
                        layout="vertical"
                        onFinish={handleSaveDiagnosis}
                        initialValues={{
                            diagnosisNotes: appointmentInfo.generalConclusion || '',
                        }}
                    >
                        <Form.Item
                            label="Kết luận cuối cùng"
                            name="diagnosisNotes"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập kết luận cuối cùng!',
                                },
                            ]}
                        >
                            <TextArea
                                rows={8}
                                placeholder="Nhập kết luận cuối cùng và hướng điều trị..."
                                disabled={isDiagnosisSaved}
                                className="resize-none focus:ring-2 focus:ring-orange-500"
                            />
                        </Form.Item>
                    </Form>
                    <div className="flex gap-3">
                        {!isDiagnosisSaved ? (
                            <Button
                                onClick={() => diagnosisForm.submit()}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
                            >
                                <Save className="h-4 w-4" />
                                Lưu kết luận
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setIsDiagnosisSaved(false)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
                            >
                                <Edit className="h-4 w-4" />
                                Chỉnh sửa
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Kết luận đã lưu */}
            {appointmentInfo.generalConclusion && (
                <Card className="shadow-sm border-emerald-200 bg-emerald-50/30">
                    <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-lg">
                        <CardTitle className="flex items-center gap-3 text-emerald-800">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                                <CheckCircle className="h-5 w-5 text-emerald-600" />
                            </div>
                            Kết luận đã lưu
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                                <Label className="text-emerald-800 font-semibold text-sm">
                                    Kết luận cuối cùng:
                                </Label>
                                <p className="text-emerald-700 mt-2 whitespace-pre-wrap leading-relaxed">
                                    {appointmentInfo.generalConclusion}
                                </p>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-emerald-700">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4" />
                                    <span>Đã lưu kết luận cuối cùng</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default memo(DiagnosisTab);
