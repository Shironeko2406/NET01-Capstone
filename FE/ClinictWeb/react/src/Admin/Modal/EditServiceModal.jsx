import { useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, Input, InputNumber } from 'antd';
import { useAsyncAction } from '../../Hooks/UseAsyncAction';
import { UpdateServiceActionAsync } from '../../Redux/ReducerAPI/ServiceReducer';

const { TextArea } = Input;

const EditServiceModal = ({ open, onOpenChange, service, filter }) => {
    const { run } = useAsyncAction();
    const [form] = Form.useForm();

    useEffect(() => {
        if (service && open) {
            form.setFieldsValue({
                name: service.name,
                price: service.price,
                description: service.description,
            });
        }
    }, [service]);

    const handleSubmit = values => {
        run(UpdateServiceActionAsync(service.serviceId, values, filter), () => {
            onOpenChange(false);
        });
    };

    const handleCancel = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa dịch vụ</DialogTitle>
                    <DialogDescription>Cập nhật thông tin chi tiết cho dịch vụ.</DialogDescription>
                </DialogHeader>

                <Form form={form} layout="vertical" onFinish={handleSubmit} className="space-y-4">
                    <Form.Item
                        name="name"
                        label={
                            <span className="block text-sm font-medium text-gray-700">
                                Tên dịch vụ
                            </span>
                        }
                        rules={[
                            {
                                required: true,
                                message: 'Tên dịch vụ không được để trống',
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tên dịch vụ" className="w-full" />
                    </Form.Item>

                    <Form.Item
                        name="price"
                        label={<span className="block text-sm font-medium text-gray-700">Giá</span>}
                        rules={[
                            {
                                required: true,
                                message: 'Giá không được để trống',
                            },
                            {
                                type: 'number',
                                min: 0,
                                message: 'Giá phải lớn hơn hoặc bằng 0',
                            },
                        ]}
                    >
                        <InputNumber
                            placeholder="Nhập giá"
                            className="!w-full"
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label={
                            <span className="block text-sm font-medium text-gray-700">Mô tả</span>
                        }
                    >
                        <TextArea placeholder="Nhập mô tả" rows={4} className="w-full" />
                    </Form.Item>

                    <DialogFooter className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            className="flex-1 bg-transparent"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            Cập nhật dịch vụ
                        </Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default EditServiceModal;
