import React, { memo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, FileText } from 'lucide-react';
import { Form, Input } from 'antd';
import { Label } from '@/components/ui/label';

const { TextArea } = Input;

const DiagnosisTab = ({ diagnosisForm }) => {
    const { appointmentInfo } = useSelector(state => state.AppointmentReducer);

    useEffect(() => {
        diagnosisForm.setFieldsValue({
            generalConclusion: appointmentInfo?.generalConclusion ?? '',
        });
    }, [appointmentInfo?.generalConclusion]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form kết luận */}
            <Card className="shadow-sm border-slate-200 p-0">
                <CardHeader className="py-4 bg-gradient-to-r from-orange-50 via-orange-50 to-orange-50 rounded-t-lg flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-base font-semibold text-gray-800">
                        <div className="p-2 bg-orange-100 rounded-lg shadow-sm">
                            <FileText className="h-5 w-5 text-orange-600" />
                        </div>
                        Kết luận cuối cùng
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 space-y-4">
                    <Form form={diagnosisForm} layout="vertical">
                        <Form.Item
                            label={
                                <span className="font-medium text-gray-700">
                                    Kết luận cuối cùng
                                </span>
                            }
                            name="generalConclusion"
                        >
                            <TextArea rows={4} disabled={true} />
                        </Form.Item>
                    </Form>
                </CardContent>
            </Card>

            {/* Kết luận đã lưu */}
            {appointmentInfo?.generalConclusion && (
                <Card className="shadow-sm border-emerald-200 p-0">
                    <CardHeader className="py-4 bg-gradient-to-r from-emerald-50 via-emerald-50 to-emerald-50 rounded-t-lg flex items-center justify-between">
                        <CardTitle className="flex items-center gap-3 text-base font-semibold text-emerald-800">
                            <div className="p-2 bg-emerald-100 rounded-lg shadow-sm">
                                <CheckCircle className="h-5 w-5 text-emerald-600" />
                            </div>
                            Kết luận đã lưu
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 px-6 pb-6">
                        <div className="space-y-4">
                            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                                <Label className="text-emerald-800 font-medium text-sm block mb-1 mt-2">
                                    Kết luận cuối cùng:
                                </Label>
                                <p className="text-emerald-700 text-sm leading-relaxed">
                                    {appointmentInfo.generalConclusion}
                                </p>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-emerald-700">
                                <div className="flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" />
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
