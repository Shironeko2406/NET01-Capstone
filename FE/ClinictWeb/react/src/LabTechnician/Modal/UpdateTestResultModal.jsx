import { Form, Input } from 'antd';
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const { TextArea } = Input;

const UpdateTestResultModal = ({
    dialogOpen,
    setDialogOpen,
    selectedService,
    form,
    handleSubmitResult,
}) => {
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-[90vw] sm:max-w-lg md:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Cập nhật kết quả xét nghiệm
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {selectedService && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="font-medium text-gray-900">
                                {selectedService.serviceName}
                            </div>
                            <div className="text-sm text-gray-600">
                                {selectedService.serviceDescription}
                            </div>
                            {selectedService.note && (
                                <div className="text-sm text-blue-600 mt-1">
                                    Ghi chú: {selectedService.note}
                                </div>
                            )}
                        </div>
                    )}

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmitResult}
                        className="space-y-4"
                    >
                        <Form.Item
                            name="result"
                            label={
                                <span className="font-medium text-gray-700">
                                    Kết quả xét nghiệm
                                </span>
                            }
                            rules={[
                                { required: true, message: 'Vui lòng nhập kết quả xét nghiệm' },
                            ]}
                        >
                            <TextArea
                                rows={8}
                                placeholder="Nhập kết quả xét nghiệm chi tiết..."
                                className="w-full"
                            />
                        </Form.Item>
                    </Form>
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => form.submit()}
                    >
                        Cập nhật kết quả
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateTestResultModal;
